import React, { forwardRef } from 'react';

const VisionSection = forwardRef((props, ref) => {
  return (
    <section className="vision-section" id="vision" ref={ref}>
      <h2>Our Vision: A Connected World of Skills</h2>
      <p>
        We envision a global ecosystem where knowledge flows freely, empowering
        individuals to learn, teach, and grow without boundaries. SkillBridge is
        the conduit for this interconnected future.
      </p>
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
  );
});

export default VisionSection;