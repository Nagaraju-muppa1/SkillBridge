import React, { forwardRef } from 'react';

const GetStartedCTA = forwardRef((props, ref) => {
  return (
    <section className="get-started-cta" ref={ref}>
      <h2>Ready to Bridge Your Skills?</h2>
      <p>Join SkillBridge today and start your journey of learning and growth.</p>
      <button className="get-started-btn">Get Started Now</button>
    </section>
  );
});

export default GetStartedCTA;