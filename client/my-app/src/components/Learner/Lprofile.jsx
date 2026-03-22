import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import './Lprofile.css';

function Lprofile() {
  const [data, setData] = useState({
    fullname: "",      // 🔥 NEW
    username: "",      // 🔥 NEW
    address: '',
    interest: '',
    contact: '',
    district: '',
    city: '',
    state: '',
    country: ''
  });

  const countries = ["India", "USA", "UK", "Canada", "Germany"];
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.put('http://localhost:5000/api/profile', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const role = res.data.user.role;

      if (role === "Learner") {
        navigate('/learner-dashboard');
      } else {
        navigate('/Profesional-dashboard');
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit} className="profile-form">
        <h2 className="form-title">Complete Your Profile</h2>

        {/* 🔥 NEW INPUTS */}
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          onChange={handleChange}
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />

        <input type="text" name="address" placeholder="Address" onChange={handleChange} />
        <input type="text" name="interest" placeholder="Interests" onChange={handleChange} />
        <input type="number" name="contact" placeholder="Phone Number" onChange={handleChange} />
        <input type="text" name="district" placeholder="District" onChange={handleChange} />
        <input type="text" name="city" placeholder="City" onChange={handleChange} />
        <input type="text" name="state" placeholder="State" onChange={handleChange} />

        <select name="country" onChange={handleChange}>
          <option value="" disabled>Select Country</option>
          {countries.map((country, idx) => (
            <option key={idx} value={country}>{country}</option>
          ))}
        </select>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Lprofile;