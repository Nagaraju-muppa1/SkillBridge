import React, { useRef, useEffect } from "react";

export default function UniverseBackground({ libsLoaded }) {
  const mountRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!libsLoaded || !mountRef.current || !window.THREE) return;

    const currentMount = mountRef.current;
    const THREE = window.THREE;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 0;
    cameraRef.current = camera;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 20000; i++) {
      starVertices.push((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000);
    }
    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(starGeometry, starMaterial);
    scene.add(particles);

    const animate = () => {
      requestAnimationFrame(animate);

      if (cameraRef.current) {
        const scrollY = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = totalHeight > 0 ? scrollY / totalHeight : 0;
        
        cameraRef.current.position.z = -scrollProgress * 600;
        cameraRef.current.fov = 75 + scrollProgress * 35;
        cameraRef.current.updateProjectionMatrix();
      }
      
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    
    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [libsLoaded]);

  return <div ref={mountRef} className="universe-background" />;
}