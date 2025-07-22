import React,{useState} from 'react';
import {Link, useNavigate } from 'react-router';
import axios from 'axios';
import './Login.css';
function Login(){
    const [formData, setFormData] = useState({
     name: '',
     email: '',
     password: '',
     role: '' // Add role to state
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
       const res = await axios.post('http://localhost:5000/api/signup',formData);
        console.log('singup succesfully',res.data.message);
        const token = res.data.token;
        localStorage.setItem('token', token); // ✅ Save the string token
        console.log("Saved token:", token);  
       if(res.data.message ==='Learner'){
         navigate('/Lprofile')
       }
       if(res.data.message ==='Professional'){
        navigate('/Pprofile')
       }
    }catch(error){
        console.log(error);
    }
  }
 return(
    <>
    <div className="signup-container">
         <div className="text-center">
            <h1 className="heading">Sign Up</h1>
         </div>
        <div className="form-wrapper">
            <form onSubmit={handleSubmit}>
            <input type="text" name="firstname" className="input-field" placeholder="FirstName" onChange={handleChange}/>
            <input type="text" name="lastname" className="input-field" placeholder="LastName" onChange={handleChange}/>
            <input type="email" name="email" className="input-field" placeholder ="Email" onChange={handleChange}/>
            <input type="password" name="password" className="input-field" placeholder='Password' onChange={handleChange}/>
            <select name="role" className="input-field" value={formData.role} onChange={handleChange}>
            <option value="">Select Role</option> {/* Placeholder */}
            <option value="Learner">Learner</option>
            <option value="Professional">Professional</option>
            </select>
            <button type="submit" className="submit-button">Sign Up</button>
            </form>
              <p className="or-text">or</p>
                <p className="signin-text">
                   Already have an account? <Link to="/signin">Signin</Link>
                </p>
        </div>
        
     
    </div>
    
    </>
 )
}

export default Login;