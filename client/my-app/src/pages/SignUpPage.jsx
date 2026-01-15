import { SignUp, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Navigate, useLocation,  useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const { user,isSignedIn, isLoaded } = useUser();
  const location = useLocation();
  const role =location.state?.role 
  console.log(role);
  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0d0d1a', color: 'white' }}>
        Loading...
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0d0d1a' }}>
      <SignUp 
        path="/sign-up" 
        signInUrl="/sign-in"
        signUpFallbackRedirectUrl={role=== "professional" ? "/onboarding/professional":"/onboarding/learner"}
      />
    </div>
  );
}