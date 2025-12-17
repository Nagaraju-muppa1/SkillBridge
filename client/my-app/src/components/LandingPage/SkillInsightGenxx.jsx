import React, { useState } from 'react';

function SkillInsightGen() {
  const [skillInput, setSkillInput] = useState('');
  const [skillInsight, setSkillInsight] = useState('');
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [insightError, setInsightError] = useState('');

  const getSkillInsight = async () => {
    if (!skillInput.trim()) {
      setInsightError('Please enter a skill to get insights.');
      return;
    }
    setIsGeneratingInsight(true);
    setInsightError('');
    setSkillInsight('');

    // This is a placeholder for your API call logic
    // For now, it just simulates a delay and returns a sample text.
    setTimeout(() => {
        setSkillInsight(`Insight for "${skillInput}": This is a valuable skill that opens up many opportunities. It involves X, Y, and Z. Mastering it requires dedication and practice.`);
        setIsGeneratingInsight(false);
    }, 1500);

    // TODO: Add your actual Gemini API call logic here if needed
  };

  return (
    <div className="skill-insight-container">
      <h3>✨ Get Skill Insights with AI ✨</h3>
      <p>
        Enter any skill you're curious about, and our AI will provide a quick
        overview!
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <input
          type="text"
          placeholder="e.g., Quantum Computing, Yoga, Digital Art"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') getSkillInsight();
          }}
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
  );
}

export default SkillInsightGen;