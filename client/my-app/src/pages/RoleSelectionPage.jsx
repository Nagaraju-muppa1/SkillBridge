// src/pages/RoleSelectionPage.jsx

import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function RoleSelectionPage() {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  // This function updates the user's role in Clerk's database
  const assignRole = async (role) => {
    if (!isLoaded || !user) {
      return;
    }
    
    try {
      // We store the role in publicMetadata. This is the standard way.
      await user.update({
        unsafeMetadata: {  // <-- CHANGED
          ...user.unsafeMetadata,
          role: role, 
        },
      });
      // After assigning the role, send them to their dashboard
     if (role === 'learner') {
        navigate('/onboarding/learner');
      } else if (role === 'professional') {
        navigate('/onboarding/professional');
      } 
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0d1a', color: 'white' }}>
      <h1>Welcome! Please select your role.</h1>
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
        <button className="get-started-btn" onClick={() => assignRole('learner')}>
          I am a Learner
        </button>
        <button className="get-started-btn" onClick={() => assignRole('professional')}>
          I am a Professional
        </button>
      </div>
    </div>
  );
}