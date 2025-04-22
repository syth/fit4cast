import React from "react";
import { useWeather, getWeatherDescription } from "./WeatherContext";

const WeatherInfo = () => {
  const { weatherData, error, isLoading } = useWeather();

  if (isLoading) return <div>Loading weather data...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Current Weather Information</h2>
      <ul>
        <li>
          <strong>Temperature:</strong> {weatherData.current.temperature_2m}°C
        </li>
        <li>
          <strong>Conditions:</strong>{" "}
          {getWeatherDescription(weatherData.current.weather_code)}
        </li>
        <li>
          <strong>Precipitation:</strong> {weatherData.current.precipitation} mm
        </li>
        <li>
          <strong>Wind Speed:</strong> {weatherData.current.wind_speed_10m} km/h
        </li>
      </ul>
    </div>
  );
};

export default WeatherInfo;
