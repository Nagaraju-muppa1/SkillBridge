// src/pages/ProfessionalOnboardingForm.jsx
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './OnboardingForm.css';
import Navigationbar from './Navigationbar';
import axios from 'axios';

export default function ProfessionalOnboardingForm() {
  const { isLoaded, user } = useUser();
  const [called,setCall]=useState(true);
  const navigate = useNavigate();
  const days =["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const countries = ["India", "USA", "UK", "Canada", "Germany"];
  const [availabledays,setAvailableDays]=useState([]);
  const [mode, setMode] = useState(""); 
  const [formData, setFormData] = useState({
    fullname:'',
    username:'',
    mobileno:'',
    skill:'',
    experience: '',
    bio:'',
    address: '',
    village: '',
    city: '',
    district: '',
    state: '',
    country: '',
    pincode:''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
   const handledays = (day) => {
    setAvailableDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day) // remove
        : [...prevDays, day] // add
    );
  };
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

    if (!formData.address  || !formData.city || !formData.state || !formData.country) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const newdata ={
        clerkUserId:user.id,
        email: user.primaryEmailAddress?.emailAddress,
        role: 'professional',
        fullname:formData.fullname,
        username:formData.username,
        mobileno:formData.mobileno,
        skill: formData.skill,
        experience:Number(formData.experience),
        bio:formData.bio,
        mode:mode,
        availabledays:availabledays,
        address:formData.address,
        village: formData.village,
        city: formData.city,
        district:formData.district,
        state:formData.state,
        country:formData.country,
        pincode:formData.pincode
      }
      console.log(newdata);
      // ---  API call logic ---
      const response = await axios.put(`http://localhost:5001/user-service/profile`,newdata);


        console.log(response);
        const data = {
             UserId : response.data.UserId,
             role : response.data.role
        }
        localStorage.setItem("customer",JSON.stringify(data));
      navigate('/professionaldashboard');

    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error("Onboarding Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 2. Use classNames instead of style props
   <>
    <div className="onboarding-container">
      <form onSubmit={handleSubmit} className="onboarding-form">
        <h2>Complete Your Professional Profile</h2>
        <div>
          <h4>Personal details</h4>
          <label for="fullname">FullName:</label>
          <input type="text" name="fullname" placeholder="Enter your FullName" onChange={handleChange} className="onboarding-input" required/><br/>
          <label for="username">UserName:</label>
          <input type="text" name="username" placeholder="Enter your UserName" onChange={handleChange} className="onboarding-input" required/><br/>
          <label for="mobileno">MobileNo:</label>
          <input type="number" name="mobileno" placeholder="Enter your contactno" onChange={handleChange} className="onboarding-input" required/><br/>
        </div>
        <div>
          <h4>Skill Information</h4>
          <label for="skill">Skill:</label>
          <input type="text" name="skill" placeholder="Skill" onChange={handleChange} className="onboarding-input" required/><br/>
          <label for="experience">Experience:</label>
          <input type="number" name="experience" placeholder="enter your experience" onChange={handleChange} className="onboarding-input" required/><br/>
          <label for="about">About:</label>
          <textarea
            name="bio"
            rows="4"
            placeholder="Briefly describe your experience, teaching style, and expertise..."
            onChange={handleChange}
            className="onboarding-input"
            maxLength={500}
            required
          ></textarea>
        </div>
        <div>
          <h4>Teaching and Availability</h4>
            <h6>Mode:</h6>
            <label ><input type="radio" name="mode" value="online" checked={mode === "online"}
            onChange={(e) => setMode(e.target.value)}
            /> Online</label>
            <label ><input type="radio" name="mode" value="offline" checked={mode === "offline"}
                onChange={(e) => setMode(e.target.value)}
              /> Offline
            </label>
            <label ><input type="radio" name="mode" value="both" checked={mode === "both"}
                onChange={(e) => setMode(e.target.value)}
              />
              Both
            </label><br/>
            <p>availableDays:</p>
            {days.map((day) => (
            <label key={day} >
              <input
                type="checkbox"
                value={day}
                checked={availabledays.includes(day)}
                onChange={() => handledays(day)}
              />
              {day}
            </label>
          ))}

        </div>
        <div>
          <h4>Address:</h4>
          <label for="address">Adressline:</label>
          <input type="text" name="address" placeholder="address line" onChange={handleChange} className="onboarding-input" required></input><br/>
          <label for="village">Village:</label>
          <input type="text" name="village" placeholder="village" onChange={handleChange} className="onboarding-input" required></input><br/>
          <label for="city/town">city/town:</label>
          <input type="text" name="city" placeholder="city/town" onChange={handleChange} className="onboarding-input"></input><br/>
          <label for="district">District:</label>
          <input type="text" name="district" placeholder="district" onChange={handleChange} className="onboarding-input"></input><br/>
           <label for="state">State:</label>
          <input type="text" name="state" placeholder="state" onChange={handleChange} className="onboarding-input"></input><br/>
         <select name="country" onChange={handleChange} value={formData.country} className="onboarding-input" required>
          <option value="" disabled>Select Country</option>
          {countries.map((country, idx) => (
            <option key={idx} value={country}>{country}</option>
          ))}
        </select>
          <label for="pincode">PinCode:</label>
          <input type="number" name="pincode" placeholder="pincode" onChange={handleChange} className="onboarding-input"></input><br/>
        </div>
        {error && <p className="onboarding-error">{error}</p>}

        <button type="submit" className="get-started-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Submit Profile'}
        </button>
      </form>
    </div>
    </>
  );
}