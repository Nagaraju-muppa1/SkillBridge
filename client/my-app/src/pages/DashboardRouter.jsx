// src/components/DashboardRouter.jsx

import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

// --- Best Practice ---
// 1. Import your real dashboards from their own files
// import LearnerDashboard from '../pages/LearnerDashboard';
// import ProfessionalDashboard from '../pages/ProfessionalDashboard';

// 2. Keep placeholders only for initial testing
const LearnerDashboard = () => <div style={{color: 'white'}}><h1>Welcome to the Learner Dashboard!</h1></div>;
const ProfessionalDashboard = () => <div style={{color: 'white'}}><h1>Welcome to the Professional Dashboard!</h1></div>;

// 3. A loading spinner is better UX than 'null'
const LoadingSpinner = () => <div style={{color: 'white', display: 'grid', placeItems: 'center', minHeight: '100vh'}}>Loading...</div>;


function DashboardRouter() {
  const { isLoaded, isSignedIn, user } = useUser();
  // Get the navigate function from React Router
  const navigate = useNavigate();

  if (!isLoaded || !isSignedIn) {
    return <LoadingSpinner />; // Use a loading spinner
  }

  const userRole = user.unsafeMetadata.role;

  // --- MODIFIED LOGIC ---

  // Case 1: Role is 'professional'
  if (userRole === 'professional') {
    return <ProfessionalDashboard />;
  } 
  
  // Case 2: Role is 'learner'
  else if (userRole === 'learner') {
    return <LearnerDashboard />;
  } 
  
  // Case 3: Role is NOT set (undefined)
  else {
    // This user hasn't completed onboarding.
    // We use React.useEffect to safely navigate *after* the component renders.
    React.useEffect(() => {
      // Redirect them to the page where they choose their role.
      // Update this path to your actual onboarding route.
      navigate('/select-role'); 
    }, [navigate]);

    // Render nothing (or a spinner) while the redirect is happening.
    return <LoadingSpinner />;
  }
}

export default DashboardRouter;