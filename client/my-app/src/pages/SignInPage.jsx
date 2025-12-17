// src/pages/SignInPage.jsx
import { SignIn, useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom"; 


export default function SignInPage() {
  const { isSignedIn, isLoaded } = useUser();

  // Show a loading state while Clerk is checking
  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0d0d1a', color: 'white' }}>
        Loading...
      </div>
    );
  }

  // If the user is already signed in, redirect them to the dashboard.
  //if (isSignedIn) {
   // return <Navigate to="/dashboard" replace />;
 // }

  // If they are signed out, show the centered Sign-In form
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0d0d1a' }}>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        
        forceRedirectUrl="/dashboard"
        // This is the correct, non-deprecated prop:
       //signInFallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}