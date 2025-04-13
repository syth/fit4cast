import React, { useState } from "react";
import "./App.css";
import Chatbot from "./Chatbot";
import WeatherInfo from "./WeatherInfo";

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
  const latitude = "43.1548";
  const longitude = "-77.6156";
  let today = new Date();
  let time = today.toLocaleTimeString();
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello! Welcome to Fit4Cast</h1>
        <button className="logout-button" onClick={onLogout}>
          Log Out
        </button>
      </header>
      <main className="main-content">
        {/* <div className="chatbot-container"> */}
        <div className="weather-info">
          <Chatbot />
          <h2>Rochester {time}</h2>
          <WeatherInfo latitude={latitude} longitude={longitude} />
        </div>
        {/* </div> */}

        <div className="activities">
          <h2>Try some of the following activities:</h2>
          <ul>
            <li>
              Swim at{" "}
              <a href="https://www.acsalaska.net/~dkadrich/goober%20lake.htm">
                Goober Lake
              </a>
            </li>
            <li>
              Hike{" "}
              <a href="https://www.acsalaska.net/~dkadrich/alascom%20tower.htm">
                Knob Hill
              </a>{" "}
              Trail
            </li>
            <li>Go Bungie Jumping!!!</li>
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
