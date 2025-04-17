import React from "react";
import { useQuery } from "@tanstack/react-query";

const getWeatherDescription = (code) => {
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

const fetchWeatherData = async ({ queryKey }) => {
  const [, latitude, longitude] = queryKey;
  // Replace first part of URL with api id.
  const apiUrl = `https://whwu7cw9z0.execute-api.us-east-1.amazonaws.com/fit4cast/weather?latitude=${latitude}&longitude=${longitude}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const WeatherInfo = ({ latitude, longitude }) => {
  console.log(latitude, longitude);
  const { data, error, isLoading } = useQuery({
    queryKey: ["weather", latitude, longitude],
    queryFn: fetchWeatherData,
  });

  if (isLoading) return <div>Loading weather data...</div>;
  if (error) return <div>Error: {error.message}</div>;
  console.log(data);

  return (
    <div>
      <h2>Current Weather Information</h2>
      <ul>
        <li>
          <strong>Temperature:</strong> {data.current.temperature_2m}°C
        </li>
        <li>
          <strong>Conditions:</strong>{" "}
          {getWeatherDescription(data.current.weather_code)}
        </li>
        <li>
          <strong>Precipitation:</strong> {data.current.precipitation} mm
        </li>
        <li>
          <strong>Wind Speed:</strong> {data.current.wind_speed_10m} km/h
        </li>
      </ul>
    </div>
  );
};

export default WeatherInfo;
