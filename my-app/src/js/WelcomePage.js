import React from 'react';
import './../styling/WelcomePage.css';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
  const navigate = useNavigate();
  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <h1>Welcome to Citrus Notes</h1>
        <p>Your one-stop solution for organizing your notes and files efficiently.</p>
        <button className="login-button" onClick={() => navigate("/login")}>
          Login to Continue
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
