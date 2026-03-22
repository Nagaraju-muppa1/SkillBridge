// src/pages/LearnerOnboardingForm.jsx
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './OnboardingForm.css';
import axios from 'axios';

export default function LearnerOnboardingForm() {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',      // 🔥 NEW
    username: '',      // 🔥 NEW
    address: '',
    interest: '',
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

    // 🔥 Updated validation
    if (
      !formData.fullname ||
      !formData.username ||
      !formData.address ||
      !formData.interest ||
      !formData.contact ||
      !formData.city ||
      !formData.state ||
      !formData.country
    ) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const newdata = {
        clerkUserId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        role: 'learner',

        // 🔥 NEW FIELDS
        fullname: formData.fullname,
        username: formData.username,

        address: formData.address,
        interest: formData.interest,
        contact: formData.contact,
        district: formData.district,
        city: formData.city,
        state: formData.state,
        country: formData.country,
      };

      const response = await axios.put(
        'http://localhost:5001/user-service/profile',
        newdata
      );

      const data = {
        clerkUserId: response.data.clerkUserId,
        UserId: response.data.UserId,
        role: response.data.role,
      };

      localStorage.setItem("customer", JSON.stringify(data));

      navigate('/learnerdashboard');

    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error("Onboarding Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <form onSubmit={handleSubmit} className="onboarding-form">
        <h2>Complete Your Learner Profile</h2>

        {/* 🔥 NEW INPUTS */}
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          onChange={handleChange}
          className="onboarding-input"
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="onboarding-input"
          required
        />

        <input type="text" name="address" placeholder="Address" onChange={handleChange} className="onboarding-input" required />
        <input type="text" name="interest" placeholder="Interests (e.g., Music, Dance)" onChange={handleChange} className="onboarding-input" required />
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

        <button type="submit" className="get-started-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Submit Profile'}
        </button>
      </form>
    </div>
  );
}