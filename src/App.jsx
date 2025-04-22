import React, { useState, useEffect } from "react";
import "./App.css";
import Chatbot from "./Chatbot";
import WeatherInfo from "./WeatherInfo";
import PreferencesForm from "./PreferencesForm";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

// Weather Page with Cognito sign-out
const WeatherPage = () => {
  const { signOut, user } = useAuthenticator();
  const [showPreferences, setShowPreferences] = useState(false);
  const [userLocation, setUserLocation] = useState({
    latitude: "43.1548", // Default to Rochester, NY
    longitude: "-77.6156",
  });
  const today = new Date();
  const time = today.toLocaleTimeString();

  useEffect(() => {
    checkUserPreferences();
  }, []);

  const checkUserPreferences = async () => {
    try {
      const response = await docClient.send(
        new GetCommand({
          TableName: "UserData",
          Key: {
            UserID: user.username,
          },
        })
      );

      if (response.Item) {
        // User has preferences, don't show the form
        setShowPreferences(false);

        // Update location if available
        if (response.Item.latitude && response.Item.longitude) {
          setUserLocation({
            latitude: response.Item.latitude,
            longitude: response.Item.longitude,
          });
        }
      } else {
        // User doesn't have preferences, show the form
        setShowPreferences(true);
      }
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
          <h2>Your Current Time: {time}</h2>
          <WeatherInfo
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
          />
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
