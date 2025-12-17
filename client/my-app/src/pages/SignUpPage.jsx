// src/pages/SignUpPage.jsx
import { SignUp, useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function SignUpPage() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0d0d1a', color: 'white' }}>
        Loading...
      </div>
    );
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0d0d1a' }}>
      <SignUp 
        path="/sign-up" 
        signInUrl="/sign-in"
        
        // This is the correct, non-deprecated prop for sign-up:
        signUpFallbackRedirectUrl="/select-role"
      />
    </div>
  );
}