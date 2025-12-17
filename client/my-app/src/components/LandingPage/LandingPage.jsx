import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import IntroductionSection from "./IntroductionSection";
import HowItWorksSection from "./HowItWorksSection";
import VisionSection from "./VisionSection";
import GetStartedCTA from "./GetStartedCTA";
import Footer from "./Footer";
import UniverseBackground from "./UniverseBackground";
import "./LandingPage.css";

function LandingPage() {
  const [libsLoaded, setLibsLoaded] = useState(false);
  const howItWorksSectionRef = useRef(null);

  // Load all necessary libraries (Three.js and GSAP)
  useEffect(() => {
    let loadedCount = 0;
    const totalScripts = 3;

    const onScriptLoad = () => {
      loadedCount++;
      if (loadedCount === totalScripts) setLibsLoaded(true);
    };
    
    const loadScript = (src, id) => {
      if (document.getElementById(id)) {
        onScriptLoad();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.id = id;
      script.async = true;
      script.onload = onScriptLoad;
      document.body.appendChild(script);
    };

    loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", "three-cdn");
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js", "gsap-cdn");
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js", "scrolltrigger-cdn");
  }, []);

  // This effect runs once the libraries are loaded and sets up the animation
  useEffect(() => {
    // Wait for the libsLoaded state to be true
    if (!libsLoaded) return;

    // ✅ THIS IS THE FIX
    // Create a function that sets up the animations
    const setupAnimations = () => {
        // Now it's safe to assume window.gsap exists
        window.gsap.registerPlugin(window.ScrollTrigger);

        const stepCircles = Array.from(howItWorksSectionRef.current.querySelectorAll('.step-circle'));
        const stepLines = Array.from(howItWorksSectionRef.current.querySelectorAll('.step-line'));

        window.gsap.timeline({
          scrollTrigger: {
            trigger: howItWorksSectionRef.current,
            start: 'top 80%',
          }
        })
        .from(stepCircles, { opacity: 0, scale: 0.5, duration: 0.8, stagger: 0.3, ease: 'back.out(1.7)' })
        .from(stepLines, { scaleX: 0, opacity: 0, duration: 0.6, stagger: 0.3, ease: 'power2.out', transformOrigin: 'left center' }, "<0.2");

        // After setting up, refresh ScrollTrigger to get correct positions
        window.ScrollTrigger.refresh();
    };
    
    // Listen for the window's 'load' event, which fires after ALL content is ready
    window.addEventListener('load', setupAnimations);

    // Cleanup the listener when the component unmounts
    return () => {
        window.removeEventListener('load', setupAnimations);
    };

  }, [libsLoaded]);

  return (
    <div className="landing-page-container">
      {libsLoaded && <UniverseBackground libsLoaded={libsLoaded} />}
      
      <Navbar />
      <HeroSection />
      <IntroductionSection />
      <HowItWorksSection ref={howItWorksSectionRef} />
      <VisionSection />
      <GetStartedCTA />
      <Footer />
    </div>
  );
}

export default LandingPage;