// src/pages/ProfessionalOnboardingForm.jsx
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './OnboardingForm.css'; // <-- 1. IMPORT THE CSS

export default function ProfessionalOnboardingForm() {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    field: '',
    experience: '',
    contact: '',
    district: '',
    city: '',
    state: '',
    country: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const countries = ["India", "USA", "UK", "Canada", "Germany"];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLoaded || !user) {
      setError('User not loaded yet. Please wait.');
      setLoading(false);
      return;
    }

    if (!formData.address || !formData.field || !formData.contact || !formData.city || !formData.state || !formData.country) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      // --- Your API call logic ---
      const response = await fetch('http://localhost:5000/api/user-service/profile', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkUserId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          role: 'professional',
          ...formData,
          experience: parseInt(formData.experience) || 0,
        }),
      });
      // --- End of API call ---

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile');
      }

      navigate('/dashboard');

    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error("Onboarding Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 2. Use classNames instead of style props
    <div className="onboarding-container">
      <form onSubmit={handleSubmit} className="onboarding-form">
        <h2>Complete Your Professional Profile</h2>

        <input type="text" name="address" placeholder="Address" onChange={handleChange} className="onboarding-input" required />
        <input type="text" name="field" placeholder="Field / Skills (e.g., Guitar, Yoga)" onChange={handleChange} className="onboarding-input" required />
        <input type="number" name="experience" placeholder="Experience (years)" onChange={handleChange} className="onboarding-input" />
        <input type="tel" name="contact" placeholder="Phone Number" onChange={handleChange} className="onboarding-input" required />
        <input type="text" name="district" placeholder="District" onChange={handleChange} className="onboarding-input" />
        <input type="text" name="city" placeholder="City" onChange={handleChange} className="onboarding-input" required />
        <input type="text" name="state" placeholder="State" onChange={handleChange} className="onboarding-input" required />

        <select name="country" onChange={handleChange} value={formData.country} className="onboarding-input" required>
          <option value="" disabled>Select Country</option>
          {countries.map((country, idx) => (
            <option key={idx} value={country}>{country}</option>
          ))}
        </select>

        {error && <p className="onboarding-error">{error}</p>}

        {/* 3. This button already had the correct className! No style prop needed. */}
        <button type="submit" className="get-started-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Submit Profile'}
        </button>
      </form>
    </div>
  );
}