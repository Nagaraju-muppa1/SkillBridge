import React, { useState } from "react";
import axios from "axios";
import {Link, useNavigate } from 'react-router';
import "./SignIn.css"; // Import the CSS

function Signn() {
  const [form, setForm] = useState({ email: "", password: "" });
   const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/signin",form);
      if(response.data.message==='Please fill the details' && response.data.role ==='Learner'){
        navigate('/Lprofile')
      }
      else if(response.data.message==='Please fill the details' && response.data.role ==='Professional'){
        navigate('/Pprofile')
      }
      else{
        const role = response.data.message.userExist.role;
      if (role === "Learner") {
        navigate('/learner-dashboard') 
      }else if(role==="Professional"){
        navigate('/Profesional-dashboard') 
      }else {
        alert("User email does not exist");
      }
      }
      
    } catch (error) {
      console.error(error);
      alert("Invalid login attempt");
    }
  };

  return (
    <div className="signin-container">
      <h1 className="signin-heading">Sign In</h1>
      <form className="signin-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          className="signin-input"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          className="signin-input"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="signin-button">
          Sign In
        </button>
      </form>
      <p className="signin-text">or</p>
      <p className="signin-text">
        Don't have an account? <a href="/signup">Signup</a>
      </p>
    </div>
  );
}

export default Signn;
