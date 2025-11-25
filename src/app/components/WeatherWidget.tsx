import React from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudDrizzle,
} from "lucide-react";
import { intPsychTheme } from "./theme";
import { WeatherData } from "../lib/hooks/useWeather";
import { DM_Serif_Text } from "next/font/google";

const dm_serif = DM_Serif_Text({ subsets: ["latin"], weight: ["400"] });

interface WeatherWidgetProps {
  weather: WeatherData | null;
}

export function getWeatherIcon(iconName: string) {
  const iconProps = { className: "w-5 h-5" };
  switch (iconName) {
    case "sun":
      return <Sun {...iconProps} />;
    case "cloud":
      return <Cloud {...iconProps} />;
    case "cloud-rain":
      return <CloudRain {...iconProps} />;
    case "cloud-lightning":
      return <CloudLightning {...iconProps} />;
    case "snowflake":
      return <Snowflake {...iconProps} />;
    case "cloud-drizzle":
      return <CloudDrizzle {...iconProps} />;
    default:
      return <Cloud {...iconProps} />;
  }
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  if (!weather) {
    return null;
  }

  return (
    <div
      style={{ color: intPsychTheme.primary }}
      className="flex items-center gap-2 rounded-xl px-4 py-2"
    >
      {getWeatherIcon(weather.icon)}
      <div className="flex flex-col">
        <span
          style={{ color: intPsychTheme.primary }}
          className={`${dm_serif.className} font-medium text-xl`}
        >
          {weather.temp}°F
        </span>
        <span
          style={{ color: intPsychTheme.primary }}
          className="text-xs capitalize"
        >
          {weather.condition.toLowerCase()}
        </span>
      </div>
    </div>
  );
}
