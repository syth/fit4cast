import React, { useState } from "react";
import "./App.css";
import Chatbot from "./Chatbot";

// Authentication Page (No actual validation, just a simple form)
const AuthenticationPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Simply trigger login regardless of input
    onLogin();
  };

  return (
    <div className="auth-page">
      <h1>Fit4Cast</h1>
      <h2>Login</h2>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

// Weather Page
const WeatherPage = ({ onLogout }) => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello, [NAME]!</h1>
        <button className="logout-button" onClick={onLogout}>
          Log Out
        </button>
      </header>
      <main className="main-content">
        <Chatbot />
        <div className="weather-info">
          <h2>Weather Information For [LOCATION]:</h2>
          <ul>
            <li>
              <strong>Temperature:</strong> [TEMPERATURE]
            </li>
            <li>
              <strong>Precipitation:</strong> [PRECIPITATION]
            </li>
            <li>
              <strong>Wind Speed:</strong> [WIND SPEED]
            </li>
            <li>
              <strong>Weather Code:</strong> [WEATHER CODE (convert to word(s))]
            </li>
          </ul>
        </div>

        <div className="activities">
          <h2>Try some of the following activities:</h2>
          <ul>
            <li>[ACTIVITY 1]</li>
            <li>[ACTIVITY 2]</li>
            <li>[ACTIVITY 3]</li>
          </ul>
        </div>
      </main>
      <footer className="App-footer">
        <p>2025 Fit4Cast Team 2B SWEN-514</p>
      </footer>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true); // Set user as authenticated
  };

  const handleLogout = () => {
    setIsAuthenticated(false); // Log the user out
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        // If authenticated, show WeatherPage with Chatbot and onLogout function
        <WeatherPage onLogout={handleLogout} />
      ) : (
        // Otherwise, show the login page
        <AuthenticationPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
