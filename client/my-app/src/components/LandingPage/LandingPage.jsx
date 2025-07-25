import React, { useEffect, useRef, useCallback, useState } from 'react';
// Removed direct import of * as THREE, will use window.THREE after CDN load

function LandingPage() {
  // State to track if external libraries (GSAP, ScrollTrigger, Three.js) are loaded
  const [libsLoaded, setLibsLoaded] = useState(false);
  // State for the new Skill Insight Generator feature
  const [skillInput, setSkillInput] = useState('');
  const [skillInsight, setSkillInsight] = useState('');
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [insightError, setInsightError] = useState('');

  // Refs for various sections and elements for GSAP animations
  const heroSectionRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroTaglineRef = useRef(null);
  const heroContentRef = useRef(null);
  const introSectionRef = useRef(null);
  const howItWorksSectionRef = useRef(null);
  const visionSectionRef = useRef(null);
  const getStartedSectionRef = useRef(null);

  // Effect to load external CDN scripts
  useEffect(() => {
    const loadScript = (src, id, callback) => {
      if (document.getElementById(id)) { // Script already exists
        callback();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.id = id;
      script.async = true;
      script.onload = callback;
      script.onerror = () => console.error(`Failed to load script: ${src}`);
      document.body.appendChild(script);
    };

    let loadedCount = 0;
    const totalScripts = 3; // GSAP, ScrollTrigger, Three.js

    const onScriptLoad = () => {
      loadedCount++;
      if (loadedCount === totalScripts) {
        setLibsLoaded(true);
      }
    };

    loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js", "gsap-cdn", onScriptLoad);
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js", "scrolltrigger-cdn", onScriptLoad);
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", "three-cdn", onScriptLoad);

    // Cleanup function (optional, but good practice for dynamically added scripts)
    return () => {
      // You might want to remove scripts here if they are only for this component,
      // but for global libraries like GSAP/Three.js, it's often left.
    };
  }, []); // Run once on component mount

  // Effect for GSAP animations, dependent on libsLoaded
  useEffect(() => {
    if (!libsLoaded) {
      return;
    }

    // Register ScrollTrigger plugin
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.refresh(); // Refresh on mount to ensure accurate calculations

    // --- Hero Section Animations ---
    // Fade in hero title and tagline
    window.gsap.fromTo([heroTitleRef.current, heroTaglineRef.current],
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, stagger: 0.3, ease: "power3.out" }
    );

    // On scroll effect for hero content (fades out and scales down)
    if (heroContentRef.current) {
      window.gsap.to(heroContentRef.current, {
        opacity: 0,
        scale: 0.8,
        y: -100, // Move up slightly as it fades out
        ease: "power1.in",
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "top top", // Start when hero section hits top
          end: "center top", // End when center of hero section hits top
          scrub: true, // Link animation to scroll position
        },
      });
    }

    // --- Section Scroll-in Animations (with zoom) ---
    const setupSectionAnimation = (sectionRef) => {
      if (sectionRef.current) {
        window.gsap.fromTo(sectionRef.current.children,
          { opacity: 0, y: 50, scale: 0.9 }, // Added scale: 0.9 for zoom-in effect
          {
            opacity: 1,
            y: 0,
            scale: 1, // Scales to original size
            duration: 1,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%", // Start animation earlier for smoother transition
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    };

    setupSectionAnimation(introSectionRef);
    setupSectionAnimation(howItWorksSectionRef);
    setupSectionAnimation(visionSectionRef);
    setupSectionAnimation(getStartedSectionRef);

    // --- How It Works Steps Animation ---
    if (howItWorksSectionRef.current) {
      const stepCircles = Array.from(howItWorksSectionRef.current.querySelectorAll('.how-it-works-steps .step-circle'));
      const stepLines = Array.from(howItWorksSectionRef.current.querySelectorAll('.how-it-works-steps .step-line'));

      window.gsap.timeline({
        scrollTrigger: {
          trigger: howItWorksSectionRef.current.querySelector('.how-it-works-steps'),
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      })
      .from(stepCircles, {
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
        stagger: 0.3,
        ease: 'back.out(1.7)'
      })
      .from(stepLines, {
        scaleX: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.3,
        ease: 'power2.out',
        transformOrigin: 'left center',
      }, "<0.2");
    }

    // --- Abstract Network Graphic Animation in Our Vision ---
    if (visionSectionRef.current) {
      const networkNodes = Array.from(visionSectionRef.current.querySelectorAll('.network-node'));
      const networkLines = Array.from(visionSectionRef.current.querySelectorAll('.network-line'));

      window.gsap.from(networkNodes, {
        opacity: 0,
        scale: 0.5,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: visionSectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        }
      });

      window.gsap.from(networkLines, {
        strokeDashoffset: 100, // Assuming stroke-dasharray is 100
        opacity: 0,
        stagger: 0.1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: visionSectionRef.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
        }
      });
    }

  }, [libsLoaded]); // Rerun GSAP animations when libraries are confirmed loaded

  // Universe Background Component (using Three.js)
  const UniverseBackground = () => {
    const mountRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const particlesRef = useRef(null);
    const mouse = useRef({ x: 0, y: 0 }); // For hover effect

    // Only run Three.js setup if libraries are loaded
    useEffect(() => {
      if (!libsLoaded || !mountRef.current || !window.THREE) {
        return;
      }

      const currentMount = mountRef.current;
      const THREE = window.THREE; // Access THREE from global window object

      // Scene
      const scene = new THREE.Scene();

      // Camera
      const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
      camera.position.z = 0; // Start at Z=0 for initial view
      cameraRef.current = camera;
      scene.add(camera);

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio); // Improve quality on high-res screens
      currentMount.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Particles (Stars)
      const starGeometry = new THREE.BufferGeometry();
      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.2,
        map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/disc.png'),
        transparent: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });

      const starVertices = [];
      for (let i = 0; i < 20000; i++) { // Increased number of stars for density
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
      }
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

      const particles = new THREE.Points(starGeometry, starMaterial);
      scene.add(particles);
      particlesRef.current = particles;

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        if (particlesRef.current) {
          // Continuous subtle rotation (reverted to previous speed)
          particlesRef.current.rotation.y += 0.005; // Reverted speed
          particlesRef.current.rotation.x += 0.0025; // Reverted speed
        }

        if (cameraRef.current) {
          const scrollY = window.scrollY;
          const totalHeight = document.body.scrollHeight - window.innerHeight;
          const scrollProgress = totalHeight > 0 ? scrollY / totalHeight : 0;

          // Scroll-responsive camera movement (flying through space - increased depth)
          cameraRef.current.position.z = -scrollProgress * 600; // More depth

          // Scroll-responsive FOV (Warp Speed Effect)
          // FOV increases from 75 up to 110 as you scroll, then back down
          const maxFovIncrease = 35; // 110 - 75
          cameraRef.current.fov = 75 + (scrollProgress * maxFovIncrease);
          cameraRef.current.updateProjectionMatrix(); // Important after changing FOV

          // Hover effect: slight camera rotation based on mouse position
          const targetRotationX = (mouse.current.y * 0.0002);
          const targetRotationY = (mouse.current.x * 0.0002);

          // Smoothly interpolate camera rotation towards target
          cameraRef.current.rotation.x += (targetRotationX - cameraRef.current.rotation.x) * 0.05;
          cameraRef.current.rotation.y += (targetRotationY - cameraRef.current.rotation.y) * 0.05;

          // Also subtly rotate particles based on mouse for a layered effect
          particlesRef.current.rotation.y += (targetRotationY * 0.1 - particlesRef.current.rotation.y) * 0.02;
          particlesRef.current.rotation.x += (targetRotationX * 0.1 - particlesRef.current.rotation.x) * 0.02;
        }

        if (rendererRef.current && cameraRef.current && particlesRef.current) {
          rendererRef.current.render(scene, cameraRef.current);
        }
      };

      // Handle window resize
      const handleResize = () => {
        if (currentMount && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = currentMount.clientWidth / currentMount.clientHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(currentMount.clientWidth, currentMount.clientHeight);
        }
      };
      window.addEventListener('resize', handleResize);

      // Handle mouse movement for hover effect
      const handleMouseMove = (event) => {
        mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', handleMouseMove);

      animate(); // Start the animation loop

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        if (currentMount.contains(renderer.domElement)) {
          currentMount.removeChild(renderer.domElement);
        }
        renderer.dispose();
        starGeometry.dispose();
        starMaterial.dispose();
      };
    }, [libsLoaded]); // Rerun Three.js setup when libraries are confirmed loaded

    // The component's render method
    return (
      <div
        ref={mountRef}
        className="fixed inset-0 z-0" // Fixed, full screen, behind content
        style={{ background: 'linear-gradient(to bottom, #0a0a1a, #000000)' }} // Deep space background
      ></div>
    );
  };

  // Function to call Gemini API for skill insight
  const getSkillInsight = async () => {
    if (!skillInput.trim()) {
      setInsightError('Please enter a skill to get insights.');
      return;
    }
    setIsGeneratingInsight(true);
    setInsightError('');
    setSkillInsight('');

    const prompt = `Provide a brief, insightful overview of the skill "${skillInput}". Focus on what it entails, why it's valuable, and perhaps a key concept, in about 3-4 sentences.`;
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = { contents: chatHistory };
    const apiKey = ""; // Canvas will automatically provide this in runtime
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setSkillInsight(text);
      } else {
        setInsightError('Could not generate insight. Please try again.');
        console.error('Gemini API response structure unexpected:', result);
      }
    } catch (apiError) {
      setInsightError('Failed to connect to the AI. Please check your network or try again later.');
      console.error('Error calling Gemini API:', apiError);
    } finally {
      setIsGeneratingInsight(false);
    }
  };


  return (
    <>
      {/* CDNs for GSAP, ScrollTrigger, and Three.js are loaded dynamically now */}

      {/* Embedded CSS */}
      <style>
        {`
          /* --- Global Resets & Base --- */
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600&family=Inter:wght@300;400;700&display=swap');

          html {
            font-size: 16px; /* Base font size for consistent rem units */
          }

          body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background-color: #0d0d1a; /* Deep dark background */
            color: #e0e0e0;
            line-height: 1.6;
          }

          .landing-page-container {
            overflow-x: hidden;
            position: relative;
            background-color: transparent; /* Allow 3D background to show through */
          }

          /* --- Navigation Bar --- */
          .navbar-placeholder {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 5%;
            background: rgba(13, 13, 26, 0.05); /* Very transparent */
            backdrop-filter: blur(10px);
            z-index: 1000;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
            transition: background 0.3s ease;
          }

          .logo {
            font-family: 'Orbitron', sans-serif; /* Futuristic font */
            font-size: 2rem; /* Using rem */
            font-weight: 700; /* Bold */
            color: #00e676;
            letter-spacing: 1px;
            text-shadow: 0 0 8px rgba(0,230,118,0.7);
          }

          .nav-links a {
            font-family: 'Rajdhani', sans-serif; /* Modern/futuristic font */
            color: #e0e0e0;
            text-decoration: none;
            margin-left: 35px;
            font-size: 1.1rem; /* Using rem */
            transition: color 0.3s ease, transform 0.2s ease;
            position: relative;
            font-weight: 600; /* Semi-bold */
          }

          .nav-links a::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            background: #00e676;
            left: 50%;
            bottom: -5px;
            transform: translateX(-50%);
            transition: width 0.3s ease;
          }

          .nav-links a:hover {
            color: #00c853;
            transform: translateY(-3px);
          }

          .nav-links a:hover::after {
            width: 100%;
          }

          .nav-login-btn, .get-started-btn {
            font-family: 'Rajdhani', sans-serif; /* Modern/futuristic font */
            background-color: #00e676;
            color: #0d0d1a;
            border: none;
            padding: 12px 30px;
            border-radius: 30px;
            font-size: 1.1rem; /* Using rem */
            font-weight: 600; /* Semi-bold */
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
            box-shadow: 0 8px 25px rgba(0, 230, 118, 0.6);
            text-transform: uppercase;
            letter-spacing: 0.8px;
          }

          .nav-login-btn:hover, .get-started-btn:hover {
            background-color: #00c853;
            transform: translateY(-5px);
            box-shadow: 0 12px 35px rgba(0, 230, 118, 0.9);
          }

          /* --- Section Base Styling --- */
          section {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 100px 5%;
            text-align: center;
            position: relative;
            background-color: rgba(13, 13, 26, 0.08); /* More transparent */
            z-index: 10;
            margin-bottom: 60px;
            border-radius: 20px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
            border: none; /* Removed border */
            overflow: hidden;
          }

          section:first-of-type {
            padding-top: calc(100px + 70px);
            margin-top: -70px;
          }

          h1, h2 {
            font-family: 'Orbitron', sans-serif; /* Futuristic font */
            font-size: 4rem; /* Using rem */
            margin-bottom: 30px;
            color: #ffffff;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
            font-weight: 900;
            letter-spacing: 1px;
          }

          p {
            font-family: 'Inter', sans-serif; /* Standard body font */
            font-size: 1.3rem; /* Using rem */
            line-height: 1.8;
            max-width: 900px;
            margin: 0 auto 40px auto;
            color: #c0c0c0;
          }

          /* --- Hero Section Specific Styling & Parallax (now using 3D background) --- */
          .hero-section {
            height: 100vh;
            background-color: transparent; /* Allow 3D background to show through */
            background-size: cover;
            background-position: center top;
            background-attachment: fixed;
            z-index: 1;
            border-radius: 0;
            box-shadow: none;
            position: relative;
          }

          .hero-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3));
            z-index: 2;
          }

          .hero-content {
            position: relative;
            z-index: 10;
            color: #ffffff;
            text-shadow: 0 0 25px rgba(255, 255, 255, 0.8);
            padding: 20px;
          }

          .hero-content h1 {
            font-family: 'Orbitron', sans-serif; /* Futuristic font */
            font-size: 5rem; /* Using rem */
            line-height: 1.1;
          }

          .hero-content p {
            font-family: 'Inter', sans-serif; /* Standard body font */
            font-size: 1.6rem; /* Using rem */
            max-width: 700px;
          }

          /* --- Introduction Section --- */
          .introduction-section {
            background-color: rgba(13, 13, 26, 0.1); /* More transparent */
          }

          .skill-insight-container {
            margin-top: 40px;
            width: 100%;
            max-width: 700px;
            background-color: rgba(0, 0, 0, 0.2); /* Slightly darker for contrast */
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            border: 1px solid rgba(0,230,118,0.1);
          }

          .skill-insight-container input {
            width: calc(100% - 120px); /* Adjust width for button */
            padding: 12px 15px;
            border-radius: 8px;
            border: 1px solid rgba(0,230,118,0.3);
            background-color: rgba(255,255,255,0.05);
            color: #e0e0e0;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.3s ease;
          }

          .skill-insight-container input:focus {
            border-color: #00e676;
            box-shadow: 0 0 10px rgba(0,230,118,0.5);
          }

          .skill-insight-container button {
            width: 110px;
            padding: 12px 0;
            margin-left: 10px;
            background-color: #00e676;
            color: #0d0d1a;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
            box-shadow: 0 4px 15px rgba(0,230,118,0.4);
          }

          .skill-insight-container button:hover {
            background-color: #00c853;
            transform: translateY(-2px);
          }

          .skill-insight-container .insight-output {
            margin-top: 20px;
            padding: 15px;
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            border: 1px dashed rgba(0,230,118,0.2);
            color: #e0e0e0;
            font-size: 1rem;
            line-height: 1.5;
            min-height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .skill-insight-container .insight-output p {
            margin: 0;
            color: #e0e0e0;
          }

          .skill-insight-container .error-message {
            color: #ff6666;
            margin-top: 10px;
            font-size: 0.9rem;
          }


          /* --- How It Works Section --- */
          .how-it-works-section {
            background-color: rgba(20, 20, 40, 0.1); /* More transparent */
          }

          .how-it-works-steps {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 50px;
            width: 90%;
            max-width: 1000px;
          }

          .step-circle {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #00e676;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #0d0d1a;
            font-weight: bold;
            font-size: 2rem; /* Using rem */
            box-shadow: 0 0 30px rgba(0, 230, 118, 0.8);
            z-index: 2;
            border: 3px solid rgba(255,255,255,0.3);
          }

          .step-circle.step-1 { background-color: #00e676; }
          .step-circle.step-2 { background-color: #66b3ff; box-shadow: 0 0 30px rgba(102,179,255,0.8); }
          .step-circle.step-3 { background-color: #ffb366; box-shadow: 0 0 30px rgba(255,179,102,0.8); }

          .step-line {
            flex-grow: 1;
            height: 5px;
            background: linear-gradient(to right, #00e676, #66b3ff);
            margin: 0 -15px;
            z-index: 1;
            border-radius: 5px;
            box-shadow: 0 0 15px rgba(0,230,118,0.5), 0 0 15px rgba(102,179,255,0.5);
          }

          /* --- Our Vision Section --- */
          .vision-section {
            background-color: rgba(13, 13, 26, 0.1); /* More transparent */
          }

          .vision-graphic-container {
            position: relative;
            width: 100%;
            max-width: 800px;
            height: 400px;
            margin-top: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            border-radius: 15px;
            background: linear-gradient(45deg, rgba(0,230,118,0.05), rgba(102,179,255,0.05));
            box-shadow: inset 0 0 30px rgba(0,230,118,0.1), inset 0 0 30px rgba(102,179,255,0.1);
          }

          .vision-graphic-container svg {
            width: 100%;
            height: 100%;
            overflow: visible;
          }

          /* Abstract glowing lines and nodes for vision graphic */
          .vision-line {
            stroke: url(#lineGradient);
            stroke-width: 3;
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            animation: drawLine 6s infinite ease-in-out alternate;
            filter: drop-shadow(0 0 8px rgba(0,230,118,0.8));
          }

          .vision-node {
            fill: #00e676;
            filter: drop-shadow(0 0 10px rgba(0,230,118,1));
            animation: nodePulse 3s infinite alternate ease-in-out;
          }

          @keyframes drawLine {
            from { stroke-dashoffset: 200; }
            to { stroke-dashoffset: 0; }
          }

          @keyframes nodePulse {
            0% { transform: scale(1); opacity: 0.9; }
            100% { transform: scale(1.1); opacity: 1; }
          }

          /* --- Get Started Call to Action --- */
          .get-started-cta {
            background-color: rgba(5, 5, 10, 0.2); /* More transparent */
            padding-bottom: 100px;
          }

          .get-started-cta h2 {
            font-size: 3.5rem; /* Using rem */
            margin-bottom: 25px;
          }

          .get-started-btn {
            animation: pulseGlow 2s infinite alternate ease-in-out;
          }

          @keyframes pulseGlow {
            0% {
              box-shadow: 0 0 20px rgba(0, 230, 118, 0.6), 0 0 30px rgba(0, 230, 118, 0.4);
            }
            100% {
              box-shadow: 0 0 35px rgba(0, 230, 118, 0.9), 0 0 50px rgba(0, 230, 118, 0.6);
            }
          }

          /* --- Footer --- */
          .footer-section {
            background-color: rgba(5, 5, 10, 0.4); /* More transparent */
            color: #a0a0a0;
            padding: 40px 5%;
            font-size: 0.95rem; /* Using rem */
            text-align: center;
            z-index: 10;
            border-top: 1px solid rgba(0, 230, 118, 0.1);
          }

          /* --- Responsive Adjustments --- */
          @media (max-width: 768px) {
            .navbar-placeholder {
              flex-direction: column;
              padding: 10px 5%;
            }

            .nav-links {
              margin-top: 15px;
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
            }

            .nav-links a {
              margin: 5px 10px;
              font-size: 0.9rem; /* Using rem */
            }

            .nav-login-btn {
              margin-top: 20px;
              width: 80%;
            }

            h1 {
              font-size: 3rem; /* Using rem */
            }

            h2 {
              font-size: 2.5rem; /* Using rem */
            }

            p {
              font-size: 1.1rem; /* Using rem */
            }

            .hero-content h1 {
              font-size: 3.5rem; /* Using rem */
            }

            .hero-content p {
              font-size: 1.3rem; /* Using rem */
            }

            .how-it-works-steps {
              flex-direction: column;
              width: 100%;
            }
            .step-line {
              width: 5px;
              height: 60px;
              background: linear-gradient(to bottom, #00e676, #66b3ff);
              margin: 10px 0;
            }

            .step-circle {
              width: 70px;
              height: 70px;
              font-size: 1.8rem; /* Using rem */
            }

            .vision-graphic-container {
              width: 90%;
              height: 300px;
            }
          }
        `}
      </style>

      <div className="landing-page-container">
        {/* --- Universe Background (Three.js) --- */}
        <UniverseBackground />

        {/* --- Navigation Bar --- */}
        <header className="navbar-placeholder">
          <div className="logo">SkillBridge</div>
          <nav className="nav-links">
            <a href="#introduction">About</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#vision">Vision</a>
            <a href="#contact">Contact</a>
          </nav>
          <button className="nav-login-btn">Login / Register</button>
        </header>

        {/* --- Hero Section: Dynamic Background & Core Message --- */}
        <section className="hero-section" ref={heroSectionRef}>
          <div className="hero-overlay"></div>
          <div className="hero-content" ref={heroContentRef}>
            <h1 ref={heroTitleRef}>Bridge Your Skills. Build Your Future.</h1>
            <p ref={heroTaglineRef}>Connect with experts, master new crafts, and unlock your full potential.</p>
          </div>
        </section>

        {/* --- Introduction Section: Explaining the Platform --- */}
        <section className="introduction-section" id="introduction" ref={introSectionRef}>
          <h2>Discover Your Potential</h2>
          <p>The SkillBridge project is a microservices-based web platform designed to bridge the gap between learners and skilled professionals across diverse fields such as music, dance, yoga, video editing, and more.</p>
          <p>With the rise of digital learning, many aspiring students struggle to find trusted, high-quality mentors in their areas of interest. This platform provides a user-friendly solution that allows students to explore various skill domains, watch demo videos by experts, and directly connect with teachers to initiate personalized learning journeys.</p>

          {/* --- New: Skill Insight Generator (Gemini API Integration) --- */}
          <div className="skill-insight-container">
            <h3>✨ Get Skill Insights with AI ✨</h3>
            <p>Enter any skill you're curious about, and our AI will provide a quick overview!</p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <input
                type="text"
                placeholder="e.g., Quantum Computing, Yoga, Digital Art"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') getSkillInsight(); }}
              />
              <button onClick={getSkillInsight} disabled={isGeneratingInsight}>
                {isGeneratingInsight ? 'Generating...' : 'Get Insight'}
              </button>
            </div>
            {insightError && <p className="error-message">{insightError}</p>}
            {skillInsight && (
              <div className="insight-output">
                <p>{skillInsight}</p>
              </div>
            )}
          </div>
        </section>

        {/* --- How It Works Section: Step-by-Step Guide --- */}
        <section className="how-it-works-section" id="how-it-works" ref={howItWorksSectionRef}>
          <h2>How It Works</h2>
          <p>A simple journey from discovery to mastery. We guide you through finding, connecting, and growing with the right mentor.</p>
          <div className="how-it-works-steps">
            <div className="step-circle step-1">1</div>
            <div className="step-line step-line-1"></div>
            <div className="step-circle step-2">2</div>
            <div className="step-line step-line-2"></div>
            <div className="step-circle step-3">3</div>
          </div>
        </section>

        {/* --- Our Vision Section: Abstract Network Graphic --- */}
        <section className="vision-section" id="vision" ref={visionSectionRef}>
          <h2>Our Vision: A Connected World of Skills</h2>
          <p>We envision a global ecosystem where knowledge flows freely, empowering individuals to learn, teach, and grow without boundaries. SkillBridge is the conduit for this interconnected future.</p>
          <div className="vision-graphic-container">
            <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00e676" />
                  <stop offset="100%" stopColor="#66b3ff" />
                </linearGradient>
              </defs>

              {/* Nodes */}
              <circle cx="100" cy="100" r="12" className="vision-node" />
              <circle cx="300" cy="50" r="12" className="vision-node" />
              <circle cx="500" cy="150" r="12" className="vision-node" />
              <circle cx="700" cy="100" r="12" className="vision-node" />
              <circle cx="200" cy="250" r="12" className="vision-node" />
              <circle cx="450" cy="350" r="12" className="vision-node" />
              <circle cx="650" cy="300" r="12" className="vision-node" />
              <circle cx="50" cy="300" r="12" className="vision-node" />

              {/* Lines (representing connections) */}
              <line x1="100" y1="100" x2="300" y2="50" className="vision-line" style={{ animationDelay: '0s' }} />
              <line x1="300" y1="50" x2="500" y2="150" className="vision-line" style={{ animationDelay: '0.5s' }} />
              <line x1="500" y1="150" x2="700" y2="100" className="vision-line" style={{ animationDelay: '1s' }} />
              <line x1="700" y1="100" x2="650" y2="300" className="vision-line" style={{ animationDelay: '1.5s' }} />
              <line x1="650" y1="300" x2="450" y2="350" className="vision-line" style={{ animationDelay: '2s' }} />
              <line x1="450" y1="350" x2="200" y2="250" className="vision-line" style={{ animationDelay: '2.5s' }} />
              <line x1="200" y1="250" x2="50" y2="300" className="vision-line" style={{ animationDelay: '3s' }} />
              <line x1="50" y1="300" x2="100" y2="100" className="vision-line" style={{ animationDelay: '3.5s' }} />

              {/* Cross connections */}
              <line x1="100" y1="100" x2="450" y2="350" className="vision-line" style={{ animationDelay: '4s' }} />
              <line x1="300" y1="50" x2="650" y2="300" className="vision-line" style={{ animationDelay: '4.5s' }} />
              <line x1="500" y1="150" x2="50" y2="300" className="vision-line" style={{ animationDelay: '5s' }} />
            </svg>
          </div>
        </section>

        {/* --- Get Started Call to Action --- */}
        <section className="get-started-cta" ref={getStartedSectionRef}>
          <h2>Ready to Bridge Your Skills?</h2>
          <p>Join SkillBridge today and start your journey of learning and growth.</p>
          <button className="get-started-btn">Get Started Now</button>
        </section>

        {/* --- Footer --- */}
        <footer className="footer-section">
          <p>&copy; {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
          <p>Developed by: {' '}
            M. DurgaPrasad (22B81A05Z6), B. Harichandra Prasad (22B81A05Z8), M.Nagaraju (22B81A05AJ)
          </p>
        </footer>
      </div>
    </>
  );
}

export default LandingPage;
