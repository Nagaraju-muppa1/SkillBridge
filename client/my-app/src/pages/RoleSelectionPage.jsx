import { useState, useEffect } from "react";
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Loader.css';

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError]= useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    // show loader for 1 second before calling API
    const timer = setTimeout(async () => {
      try {
        const clerkUserId = user.id;
        const response = await axios.get(`http://localhost:5001/getRole/${clerkUserId}`);
        const data = {
             clerkUserId : response.data.clerkUserId,
             UserId : response.data.UserId,
             role : response.data.role
        }
        localStorage.setItem("customer",JSON.stringify(data));
        const fetchedRole = response.data.role;
        setRole(fetchedRole);

        // navigate based on role
        if (fetchedRole === "professional") {
          navigate("/professionaldashboard", { replace: true });
        } else {
          navigate("/learnerdashboard", { replace: true });
        }
      } catch (error) {
        setError(true);
        console.log(error);
      } finally {
        setLoading(false); 
      }
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, [isLoaded, user, navigate]);

  if(loading){
      return (
    <>
      { loading && (
        <div className="loader-page">
   
        <div className="loader"></div>
          <p>Preparing your dashboard...</p>
        </div>
      )
      }
      
    </>
      )
  }
  if (error) {
  return (
    <div className="loader-page">
      <div className="error-container">
        <p>Something went wrong. Please try again.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    </div>
  );
}


}
