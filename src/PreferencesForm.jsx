import React, { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

const PreferencesForm = ({ onComplete, existingPreferences }) => {
  const { user } = useAuthenticator();
  // Predefined locations with their coordinates
  const locations = [
    { name: "Rochester, NY", latitude: "43.1548", longitude: "-77.6156" },
    { name: "New York City, NY", latitude: "40.7128", longitude: "-74.0060" },
    { name: "Los Angeles, CA", latitude: "34.0522", longitude: "-118.2437" },
    { name: "Chicago, IL", latitude: "41.8781", longitude: "-87.6298" },
    { name: "Miami, FL", latitude: "25.7617", longitude: "-80.1918" },
    { name: "Seattle, WA", latitude: "47.6062", longitude: "-122.3321" },
    { name: "Denver, CO", latitude: "39.7392", longitude: "-104.9903" },
  ];

  // Find the closest location match based on existing coordinates
  const findLocationMatch = (lat, long) => {
    if (!lat || !long) return 0; // Default to Rochester if no coordinates

    // Handle DynamoDB format where values might be objects with S property
    const latitude = lat?.S || lat;
    const longitude = long?.S || long;

    // Try to find an exact match first
    const exactMatch = locations.findIndex(
      (loc) => loc.latitude === latitude && loc.longitude === longitude
    );

    if (exactMatch !== -1) return exactMatch;

    // Default to Rochester (index 0) if no match found
    return 0;
  };

  // Determine initial selected location
  const initialLocationIndex = existingPreferences
    ? findLocationMatch(
        existingPreferences.latitude,
        existingPreferences.longitude
      )
    : 0;

  const [selectedLocationIndex, setSelectedLocationIndex] = useState(
    initialLocationIndex
  );

  // Helper function to extract activities from DynamoDB format
  const extractActivities = (activitiesData) => {
    if (!activitiesData) return [];

    // Handle DynamoDB L (list) format
    if (activitiesData.L && Array.isArray(activitiesData.L)) {
      return activitiesData.L.map((item) => item.S || item);
    }

    // Handle regular array
    if (Array.isArray(activitiesData)) {
      return activitiesData;
    }

    // Handle comma-separated string from preferences field
    if (existingPreferences.preferences) {
      const prefsString =
        existingPreferences.preferences.S || existingPreferences.preferences;
      return prefsString.split(",");
    }

    return [];
  };

  // Helper function to extract string value from DynamoDB format
  const extractStringValue = (value, defaultValue) => {
    if (!value) return defaultValue;
    return value.S || value;
  };

  const [preferences, setPreferences] = useState(
    existingPreferences
      ? {
          activities: extractActivities(existingPreferences.activities),
          intensity: extractStringValue(
            existingPreferences.intensity,
            "medium"
          ),
          preferredTime: extractStringValue(
            existingPreferences.preferredTime,
            "morning"
          ),
          indoorOutdoor: extractStringValue(
            existingPreferences.indoorOutdoor,
            "both"
          ),
          latitude: extractStringValue(
            existingPreferences.latitude,
            locations[initialLocationIndex].latitude
          ),
          longitude: extractStringValue(
            existingPreferences.longitude,
            locations[initialLocationIndex].longitude
          ),
        }
      : {
          activities: [],
          intensity: "medium",
          preferredTime: "morning",
          indoorOutdoor: "both",
          latitude: locations[initialLocationIndex].latitude,
          longitude: locations[initialLocationIndex].longitude,
        }
  );

  const activities = [
    "Running",
    "Swimming",
    "Cycling",
    "Hiking",
    "Yoga",
    "Weight Training",
    "Basketball",
    "Tennis",
  ];

  const handleActivityToggle = (activity) => {
    setPreferences((prev) => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter((a) => a !== activity)
        : [...prev.activities, activity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a combined lat_long string in the format expected by DynamoDB
      const lat_long = `${preferences.latitude}:${preferences.longitude}`;

      // prefered activites
      const preferencesString = preferences.activities.join(",");

      await docClient.send(
        new PutCommand({
          TableName: "UserData",
          Item: {
            UserID: user.userId,
            email: user?.signInDetails?.loginId || user.username,
            lat_long: lat_long,
            preferences: preferencesString,
            // Include other fields as needed
            ...preferences,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        })
      );

      // const subscribeUrl = `${import.meta.env.VITE_API_GATEWAY_LINK}/subscribe`;
      // const userEmail = user?.signInDetails?.loginId || user.username;
      
      // await fetch(subscribeUrl, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email: userEmail }),
      // });

      onComplete();
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  return (
    <div className="preferences-form">
      <h2>
        {existingPreferences ? "Update" : "Set"} Your Activity Preferences
      </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <h3>Select Your Favorite Activities:</h3>
          <div className="activities-grid">
            {activities.map((activity) => (
              <label key={activity}>
                <input
                  type="checkbox"
                  checked={preferences.activities.includes(activity)}
                  onChange={() => handleActivityToggle(activity)}
                />
                {activity}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3>Preferred Intensity:</h3>
          <select
            value={preferences.intensity}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                intensity: e.target.value,
              }))
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <h3>Preferred Time:</h3>
          <select
            value={preferences.preferredTime}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                preferredTime: e.target.value,
              }))
            }
          >
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </div>

        <div>
          <h3>Indoor/Outdoor Preference:</h3>
          <select
            value={preferences.indoorOutdoor}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                indoorOutdoor: e.target.value,
              }))
            }
          >
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div>
          <h3>Your Location:</h3>
          <div style={{ marginBottom: "10px" }}>
            <label>Select a city: </label>
            <select
              value={selectedLocationIndex}
              onChange={(e) => {
                const index = parseInt(e.target.value);
                setSelectedLocationIndex(index);
                setPreferences((prev) => ({
                  ...prev,
                  latitude: locations[index].latitude,
                  longitude: locations[index].longitude,
                }));
              }}
              style={{ padding: "5px", marginLeft: "10px", minWidth: "200px" }}
            >
              {locations.map((location, index) => (
                <option key={index} value={index}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <div>
              <label>Latitude:</label>
              <input
                type="text"
                value={preferences.latitude}
                readOnly
                style={{ backgroundColor: "#f0f0f0" }}
              />
            </div>
            <div>
              <label>Longitude:</label>
              <input
                type="text"
                value={preferences.longitude}
                readOnly
                style={{ backgroundColor: "#f0f0f0" }}
              />
            </div>
          </div>
          <small>
            Your location will be used to display local weather and suggest
            nearby activities.
          </small>
        </div>

        <button type="submit">
          {existingPreferences ? "Update" : "Save"} Preferences
        </button>
      </form>
    </div>
  );
};

export default PreferencesForm;
