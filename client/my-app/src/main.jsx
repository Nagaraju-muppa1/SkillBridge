// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.jsx';
import './index.css';

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

/**
 * This new component is the key. 
 * It's inside <BrowserRouter> so it can use the useNavigate() hook.
 * It then renders <ClerkProvider> and passes the navigate function to it.
 */
function ClerkProviderWithNavigate() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      <App />
    </ClerkProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1. <BrowserRouter> now wraps your entire app. This fixes the error. */}
    <BrowserRouter>
      {/* 2. This component provides the navigate function to Clerk */}
      <ClerkProviderWithNavigate />
    </BrowserRouter>
  </React.StrictMode>
);