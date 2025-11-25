import { useState, useEffect, useCallback } from "react";

export interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
}

const CACHE_KEY = "weather_cache";
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

interface CachedWeather {
  data: WeatherData;
  timestamp: number;
}

// Module-level cache to share across all instances
let globalWeatherCache: CachedWeather | null = null;

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (response.ok) {
        const data = await response.json();
        const weatherData: WeatherData = {
          temp: data.temp,
          condition: data.condition,
          icon: data.icon,
        };

        // Update both module cache and sessionStorage
        const cached: CachedWeather = {
          data: weatherData,
          timestamp: Date.now(),
        };
        globalWeatherCache = cached;

        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(cached));
          } catch (e) {
            // sessionStorage might be disabled
            console.warn("Failed to cache weather in sessionStorage:", e);
          }
        }

        setWeather(weatherData);
        return weatherData;
      }
    } catch (error) {
      console.error("Failed to load weather:", error);
    }
    return null;
  }, []);

  const getCachedWeather = useCallback((): WeatherData | null => {
    // First check module-level cache
    if (globalWeatherCache) {
      const age = Date.now() - globalWeatherCache.timestamp;
      if (age < CACHE_DURATION) {
        return globalWeatherCache.data;
      }
      // Cache expired
      globalWeatherCache = null;
    }

    // Then check sessionStorage
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed: CachedWeather = JSON.parse(cached);
          const age = Date.now() - parsed.timestamp;
          if (age < CACHE_DURATION) {
            // Restore to module cache
            globalWeatherCache = parsed;
            return parsed.data;
          } else {
            // Cache expired, remove it
            sessionStorage.removeItem(CACHE_KEY);
          }
        }
      } catch (e) {
        // sessionStorage might be disabled or corrupted
        console.warn("Failed to read weather cache:", e);
      }
    }

    return null;
  }, []);

  useEffect(() => {
    // Check cache first
    const cached = getCachedWeather();
    if (cached) {
      setWeather(cached);
      setLoading(false);
      return;
    }

    // No valid cache, fetch fresh data
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeather(
              position.coords.latitude,
              position.coords.longitude
            ).then(() => setLoading(false));
          },
          (error) => {
            console.error("Geolocation error:", error);
            // Fallback to a default location (e.g., New York) if geolocation fails
            fetchWeather(40.7128, -74.006).then(() => setLoading(false));
          }
        );
      } else {
        // Fallback if geolocation is not supported
        fetchWeather(40.7128, -74.006).then(() => setLoading(false));
      }
    };

    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return { weather, loading };
}

