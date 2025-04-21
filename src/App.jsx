import React, { useState, useEffect } from "react";
import "./App.css";
import Chatbot from "./Chatbot";
import WeatherInfo from "./WeatherInfo";
import PreferencesForm from "./PreferencesForm";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";

const client = generateClient();

// Weather Page with Cognito sign-out
const WeatherPage = () => {
  const { signOut, user } = useAuthenticator();
  const [showPreferences, setShowPreferences] = useState(false);
  const latitude = "43.1548";
  const longitude = "-77.6156";
  const today = new Date();
  const time = today.toLocaleTimeString();

  useEffect(() => {
    checkUserPreferences();
  }, []);

  const checkUserPreferences = async () => {
    try {
      const preferences = await client.models.UserPreferences.get({
        userId: user.username,
      });
      setShowPreferences(!preferences);
    } catch (e) {
      console.error("Error fetching preferences:", e);
      setShowPreferences(true);
    }
  };

  if (showPreferences) {
    return <PreferencesForm onComplete={() => setShowPreferences(false)} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello! Welcome to Fit4Cast</h1>
        <button className="logout-button" onClick={signOut}>
          Log Out
        </button>
      </header>
      <main className="main-content">
        <div className="weather-info">
          <Chatbot />
          <h2>Rochester {time}</h2>
          <WeatherInfo latitude={latitude} longitude={longitude} />
        </div>

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
  return <WeatherPage />;
}

export default App;
