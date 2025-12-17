// src/pages/ProfessionalOnboardingForm.jsx
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
// Optional: Import your Profile.css if you want to reuse styles
// import './Profile.css'; 

export default function ProfessionalOnboardingForm() {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    field: '', // Renamed from 'skills' to match your example
    experience: '',
    contact: '',
    district: '',
    city: '',
    state: '',
    country: '', // Default to empty
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const countries = ["India", "USA", "UK", "Canada", "Germany"]; // From your example

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

    // Basic validation (add more as needed)
    if (!formData.address || !formData.field || !formData.contact || !formData.city || !formData.state || !formData.country) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      // --- Replace with your actual User Service API endpoint ---
      const response = await fetch('/api/user-service/profile', { 
        method: 'POST', // Or PUT if updating an existing stub profile
        headers: {
          'Content-Type': 'application/json',
          // You'll likely need an Authorization header here, sending a token obtained from Clerk
        },
        body: JSON.stringify({
          clerkUserId: user.id, // CRITICAL: Link to Clerk user
          role: 'professional', // Explicitly set the role
          ...formData, // Spread the rest of the form data
          experience: parseInt(formData.experience) || 0, // Ensure experience is a number
        }),
      });
       // --- End of API call ---

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile');
      }

      navigate('/dashboard'); // Redirect to the professional dashboard

    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error("Onboarding Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Basic styles (replace with your Profile.css classes if preferred)
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', background: 'rgba(255,255,255,0.1)', color: 'white', marginBottom: '15px', boxSizing: 'border-box' };
  const selectStyle = { ...inputStyle };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0d0d1a', color: 'white', padding: '20px' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Complete Your Professional Profile</h2>

        <input type="text" name="address" placeholder="Address" onChange={handleChange} style={inputStyle} required />
        <input type="text" name="field" placeholder="Field / Skills (e.g., Guitar, Yoga)" onChange={handleChange} style={inputStyle} required />
        <input type="number" name="experience" placeholder="Experience (years)" onChange={handleChange} style={inputStyle} />
        <input type="tel" name="contact" placeholder="Phone Number" onChange={handleChange} style={inputStyle} required />
        <input type="text" name="district" placeholder="District" onChange={handleChange} style={inputStyle} />
        <input type="text" name="city" placeholder="City" onChange={handleChange} style={inputStyle} required />
        <input type="text" name="state" placeholder="State" onChange={handleChange} style={inputStyle} required />

        <select name="country" onChange={handleChange} value={formData.country} style={selectStyle} required>
          <option value="" disabled>Select Country</option>
          {countries.map((country, idx) => (
            <option key={idx} value={country}>{country}</option>
          ))}
        </select>

        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}

        <button type="submit" className="get-started-btn" disabled={loading} style={{ width: '100%', padding: '12px' }}>
          {loading ? 'Saving...' : 'Submit Profile'}
        </button>
      </form>
    </div>
  );
}