import React, { forwardRef } from 'react';

const HowItWorksSection = forwardRef((props, ref) => {
  return (
    <section className="how-it-works-section" id="how-it-works" ref={ref}>
      <h2>How It Works</h2>
      <p>
        A simple journey from discovery to mastery. We guide you through
        finding, connecting, and growing with the right mentor.
      </p>
      <div className="how-it-works-steps">
        <div className="step-circle step-1">1</div>
        <div className="step-line step-line-1"></div>
        <div className="step-circle step-2">2</div>
        <div className="step-line step-line-2"></div>
        <div className="step-circle step-3">3</div>
      </div>
    </section>
  );
});

export default HowItWorksSection;