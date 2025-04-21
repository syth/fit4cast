import React, { useState } from "react";
import { generateClient } from "aws-amplify/api";
import { useAuthenticator } from "@aws-amplify/ui-react";

const client = generateClient();

const PreferencesForm = ({ onComplete }) => {
  const { user } = useAuthenticator();
  const [preferences, setPreferences] = useState({
    activities: [],
    intensity: "medium",
    preferredTime: "morning",
    indoorOutdoor: "both",
  });

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
      await client.models.UserPreferences.create({
        userId: user.username,
        ...preferences,
      });
      onComplete();
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  return (
    <div className="preferences-form">
      <h2>Set Your Activity Preferences</h2>
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

        <button type="submit">Save Preferences</button>
      </form>
    </div>
  );
};

export default PreferencesForm;
