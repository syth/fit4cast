import React from "react";
import { useQuery } from "@tanstack/react-query";

const fetchWeatherData = async ({ queryKey }) => {
  const [, latitude, longitude] = queryKey;
  // Replace <restapi-id>, <region>, and <stage> with your actual values.
  const apiUrl = `https://mpmrop89t8.execute-api.us-east-1.amazonaws.com/fit4cast/weather?latitude=${latitude}&longitude=${longitude}`;

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
