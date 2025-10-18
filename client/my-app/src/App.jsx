// src/App.jsx
import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

// Import Your Pages
import LandingPage from './components/LandingPage/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import LearnerOnboardingForm from './pages/LearnerOnboardingForm';
import ProfessionalOnboardingForm from './pages/ProfessionalOnboardingForm';
import DashboardRouter from './pages/DashboardRouter';

/**
 * This component protects routes that ONLY signed-in users can see.
 * - If you're signed in, it shows the page (the <Outlet />).
 * - If you're NOT signed in, it redirects you to "/sign-in".
 */
function ProtectedLayout() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isSignedIn ? <Outlet /> : <Navigate to="/sign-in" replace />;
}

function App() {
  return (
    <Routes>
      {/* --- Public-Only Routes --- */}
      {/* These pages are for signed-out users.
        The logic to redirect logged-in users away is inside the components themselves.
      */}
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />

      {/* --- Public Route --- */}
      {/* Anyone can see the landing page, logged in or not */}
      <Route path="/" element={<LandingPage />} />

      {/* --- Protected Routes --- */}
      {/* All routes inside here require you to be signed in. */}
      <Route element={<ProtectedLayout />}>
        <Route path="/select-role" element={<RoleSelectionPage />} />
        <Route path="/onboarding/learner" element={<LearnerOnboardingForm />} />
        <Route path="/onboarding/professional" element={<ProfessionalOnboardingForm />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        {/* Add any other protected routes here */}
      </Route>

      {/* A catch-all route to redirect 404s to the home page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;