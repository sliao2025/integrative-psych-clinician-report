import { NextRequest, NextResponse } from "next/server";

// Map WMO weather codes to conditions and icons
// Based on WMO Weather interpretation codes (WW)
function getWeatherCondition(weatherCode: number): {
  condition: string;
  icon: string;
} {
  // Clear sky
  if (weatherCode === 0) {
    return { condition: "Clear", icon: "sun" };
  }
  // Mainly clear, partly cloudy, overcast
  if (weatherCode >= 1 && weatherCode <= 3) {
    return { condition: "Cloudy", icon: "cloud" };
  }
  // Fog and depositing rime fog
  if (weatherCode >= 45 && weatherCode <= 48) {
    return { condition: "Foggy", icon: "cloud-drizzle" };
  }
  // Drizzle: Light, moderate, dense
  if (weatherCode >= 51 && weatherCode <= 57) {
    return { condition: "Drizzle", icon: "cloud-drizzle" };
  }
  // Rain: Slight, moderate, heavy
  if (weatherCode >= 61 && weatherCode <= 67) {
    return { condition: "Rain", icon: "cloud-rain" };
  }
  // Snow: Slight, moderate, heavy
  if (weatherCode >= 71 && weatherCode <= 77) {
    return { condition: "Snow", icon: "snowflake" };
  }
  // Rain showers: Slight, moderate, violent
  if (weatherCode >= 80 && weatherCode <= 82) {
    return { condition: "Rain", icon: "cloud-rain" };
  }
  // Snow showers: Slight, moderate, heavy
  if (weatherCode >= 85 && weatherCode <= 86) {
    return { condition: "Snow", icon: "snowflake" };
  }
  // Thunderstorm: Slight, moderate, heavy, with hail
  if (weatherCode >= 95 && weatherCode <= 99) {
    return { condition: "Thunderstorm", icon: "cloud-lightning" };
  }
  // Default to cloudy
  return { condition: "Cloudy", icon: "cloud" };
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    );
  }

  try {
    // Open-Meteo API - no API key required, free for non-commercial use
    // Using temperature_unit=fahrenheit to get Fahrenheit temperatures
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`
    );

    if (!response.ok) {
      throw new Error("Weather API request failed");
    }

    const data = await response.json();

    const temp = Math.round(data.current.temperature_2m);
    const weatherCode = data.current.weather_code;
    const { condition, icon } = getWeatherCondition(weatherCode);

    return NextResponse.json({
      temp: temp,
      condition: condition,
      icon: icon,
    });
  } catch (error) {
    console.error("Weather API error:", error);
    // Return fallback data on error
    return NextResponse.json({
      temp: 72,
      condition: "Clear",
      icon: "sun",
    });
  }
}

