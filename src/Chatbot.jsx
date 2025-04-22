import React, { useState } from "react";
import {
  LexRuntimeServiceClient,
  PostTextCommand,
} from "@aws-sdk/client-lex-runtime-service";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { useWeather } from "./WeatherContext";

const botName = "ActivitySuggesterBot";
const botAlias = "ReactAlias";

const dbClient = new DynamoDBClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(dbClient);

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const { user } = useAuthenticator();
  const userId = user.userId;
  // Get weather data from context
  const { weatherData, latitude, longitude } = useWeather();

  const sendMessage = async (message) => {
    const client = new LexRuntimeServiceClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      },
    });

    // Fetch user preferences from DynamoDB
    let userPreferences = {};
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
        userPreferences = response.Item;
      }
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }

    // Extract activities from comma-separated string
    // const activities = userPreferences.preferences
    //   ? userPreferences.preferences.split(",")
    //   : [];

    // Prepare session attributes with user preferences and weather data
    const sessionAttributes = {
      // Include user preferences in the session
      userPreferences: JSON.stringify({
        preferences: userPreferences.preferences || "",
        activities: userPreferences.activities || [],
        intensity: userPreferences.intensity || "medium",
        preferredTime: userPreferences.preferredTime || "morning",
        indoorOutdoor: userPreferences.indoorOutdoor || "both",
      }),
    };

    // Add weather data if available
    if (weatherData) {
      sessionAttributes.weatherData = JSON.stringify({
        temperature: weatherData.current.temperature_2m,
        weatherCode: weatherData.current.weather_code,
        precipitation: weatherData.current.precipitation,
        windSpeed: weatherData.current.wind_speed_10m,
        latitude: latitude,
        longitude: longitude,
      });
    }

    const params = {
      botName,
      botAlias,
      userId,
      inputText: message,
      sessionAttributes,
    };

    const command = new PostTextCommand(params);
    try {
      const response = await client.send(command);
      // Update conversation: add your message
      setConversation((prev) => [...prev, { from: "user", text: message }]);

      // Add bot response to conversation
      if (response.message) {
        setConversation((prev) => [
          ...prev,
          { from: "bot", text: response.message },
        ]);
      }
    } catch (error) {
      console.error("Error communicating with Lex:", error);
      setConversation((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Sorry, there was an error processing your request.",
        },
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        marginTop: "1rem",
        backgroundColor: "#fff",
        borderRadius: "8px",
      }}
    >
      <h2>Chat with Jcandbot</h2>
      <div
        style={{
          height: "200px",
          overflowY: "scroll",
          border: "1px solid #eee",
          padding: "0.5rem",
          backgroundColor: "#fff",
          borderRadius: "8px",
        }}
      >
        {conversation.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.from === "user" ? "right" : "left",
              margin: "0.5rem 0",
            }}
          >
            <span
              style={{
                background: msg.from === "user" ? "#dcf8c6" : "#f1f0f0",
                padding: "0.5rem",
                borderRadius: "4px",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ width: "80%", padding: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
