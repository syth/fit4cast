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
  const [existingPreferences, setExistingPreferences] = useState(null);
  const today = new Date();
  const time = today.toLocaleTimeString();

  useEffect(() => {
    console.log("User object:", user);
    checkUserPreferences();
  }, []);

  const checkUserPreferences = async () => {
    try {
      const response = await docClient.send(
        new GetCommand({
          TableName: "UserData",
          Key: {
            UserID: user.userId,
          },
        })
      );

      if (response.Item) {
        // User has preferences, don't show the form
        setShowPreferences(false);

        // Store the existing preferences
        setExistingPreferences(response.Item);

        // Update location if available
        if (response.Item.latitude && response.Item.longitude) {
          // If latitude and longitude are stored separately
          setUserLocation({
            latitude: response.Item.latitude,
            longitude: response.Item.longitude,
          });
        } else if (response.Item.lat_long) {
          // If latitude and longitude are stored as a combined string (e.g., "43.15501:-77.596855")
          const [lat, long] = response.Item.lat_long.split(":");
          if (lat && long) {
            setUserLocation({
              latitude: lat,
              longitude: long,
            });
          }
        }
      } else {
        // User doesn't have preferences, show the form
        setShowPreferences(true);
        setExistingPreferences(null);
      }
    } catch (e) {
      console.error("Error fetching preferences:", e);
      setShowPreferences(true);
      setExistingPreferences(null);
    }
  };

  const handleChangePreferences = () => {
    setShowPreferences(true);
  };

  if (showPreferences) {
    return (
      <PreferencesForm
        onComplete={() => {
          setShowPreferences(false);
          checkUserPreferences(); // Refresh preferences after saving
        }}
        existingPreferences={existingPreferences}
      />
    );
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello! Welcome to Fit4Cast {user.signInDetails.loginId}</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="preferences-button"
            onClick={handleChangePreferences}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Change Preferences
          </button>
          <button
            className="logout-button"
            onClick={signOut}
            style={{
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Log Out
          </button>
        </div>
      </header>
      <main className="main-content">
        <div className="weather-info">
          <Chatbot />
          <h2>Rochester {time}</h2>
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
