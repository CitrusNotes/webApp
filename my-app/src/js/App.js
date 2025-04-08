import './../styling/App.css';
import React, { useState } from "react";
import WelcomePage from "./WelcomePage";
import LoginPage from "./LoginPage";
import FileBrowser from "./FileBrowser";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  const [showWelcomePage, setShowWelcomePage] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return(
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage/>}></Route>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/file-browser" element={<FileBrowser/>}></Route>
      </Routes>
    </Router>
    
  );

  // Show Welcome Page
  if (showWelcomePage) {
    return <WelcomePage setShowWelcomePage={() => setShowWelcomePage(false)} />;
  }

  // Show Login Page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage setIsAuthenticated={setIsAuthenticated} />;
  }

  // Show Home Page after successful login
  return <FileBrowser/>
}

export default App;
 