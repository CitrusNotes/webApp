import React from 'react';
import './WelcomePage.css';

function WelcomePage({ setShowHomePage }) {
  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <h1>Welcome to Citrus Notes</h1>
        <p>Your one-stop solution for organizing your notes and files efficiently.</p>
        <button className="login-button" onClick={() => setShowHomePage(true)}>
          Login to Continue
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
