import React from 'react';
import SkillInsightGen from './SkillInsightGenxx'; // Make sure the filename is correct

// No more forwardRef, props, or ref
function IntroductionSection() { 
  return (
    <section className="introduction-section" id="introduction">
      <h2>Discover Your Potential</h2>
      <p>
        The SkillBridge project is a microservices-based web platform designed to
        bridge the gap between learners and skilled professionals across diverse
        fields such as music, dance, yoga, video editing, and more.
      </p>
      <p>
        With the rise of digital learning, many aspiring students struggle to
        find trusted, high-quality mentors in their areas of interest. This
        platform provides a user-friendly solution that allows students to
        explore various skill domains, watch demo videos by experts, and directly
        connect with teachers to initiate personalized learning journeys.
      </p>
      <SkillInsightGen />
    </section>
  );
}

export default IntroductionSection;