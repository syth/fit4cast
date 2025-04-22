import React, { createContext, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Create the context
const WeatherContext = createContext(null);

// Weather code descriptions
export const getWeatherDescription = (code) => {
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return weatherCodes[code] || "Unknown weather condition";
};

// Function to fetch weather data
const fetchWeatherData = async ({ queryKey }) => {
  const [, latitude, longitude] = queryKey;
  const apiUrl =
    import.meta.env.VITE_API_GATEWAY_LINK +
    `?latitude=${latitude}&longitude=${longitude}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Create the provider component
export const WeatherProvider = ({ children, latitude, longitude }) => {
  // Fetch weather data using React Query
  const { data, error, isLoading } = useQuery({
    queryKey: ["weather", latitude, longitude],
    queryFn: fetchWeatherData,
    enabled: !!latitude && !!longitude,
  });

  // Create the value object to be provided by the context
  const weatherContextValue = {
    weatherData: data,
    isLoading,
    error,
    latitude,
    longitude,
  };

  return (
    <WeatherContext.Provider value={weatherContextValue}>
      {children}
    </WeatherContext.Provider>
  );
};

// Custom hook to use the weather context
export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === null) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};
