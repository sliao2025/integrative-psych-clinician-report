import React from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudDrizzle,
} from "lucide-react";
import { intPsychTheme, sigmundTheme } from "./theme";
import { WeatherData } from "../lib/hooks/useWeather";
import { DM_Sans, DM_Serif_Text } from "next/font/google";

const dm_sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const dm_serif = DM_Serif_Text({ subsets: ["latin"], weight: ["400"] });

interface WeatherWidgetProps {
  weather: WeatherData | null;
}

export function getWeatherIcon(iconName: string) {
  const iconProps = { className: "w-6 h-6" };
  switch (iconName) {
    case "sun":
      return (
        <Sun
          {...iconProps}
          className={`w-6 h-6 text-[${intPsychTheme.secondary}]`}
        />
      ); // Secondary Orange
    case "cloud":
      return (
        <Cloud
          {...iconProps}
          className={`w-6 h-6 text-[${intPsychTheme.accent}]`}
        />
      ); // Accent Blue
    case "cloud-rain":
      return (
        <CloudRain
          {...iconProps}
          className={`w-6 h-6 text-[${intPsychTheme.primary}]`}
        />
      ); // Primary Navy
    case "cloud-lightning":
      return (
        <CloudLightning
          {...iconProps}
          className={`w-6 h-6 text-[${intPsychTheme.primary}]`}
        />
      );
    case "snowflake":
      return (
        <Snowflake
          {...iconProps}
          className={`w-6 h-6 text-[${intPsychTheme.accent}]`}
        />
      );
    case "cloud-drizzle":
      return (
        <CloudDrizzle
          {...iconProps}
          className={`w-6 h-6 text-[${intPsychTheme.accent}]`}
        />
      );
    default:
      return (
        <Cloud
          {...iconProps}
          className={`w-6 h-6 text-[${intPsychTheme.accent}]`}
        />
      );
  }
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  if (!weather) {
    return null;
  }

  return (
    <div
      style={{ color: sigmundTheme.secondaryDark }}
      className="flex items-center gap-2 rounded-xl px-4 py-2"
    >
      {getWeatherIcon(weather.icon)}
      <div className="flex flex-col">
        <span
          style={{ color: sigmundTheme.secondaryDark }}
          className={`${dm_serif.className} font-medium text-xl`}
        >
          {weather.temp}°F
        </span>
        <span
          style={{ color: sigmundTheme.secondaryDark }}
          className="text-xs capitalize"
        >
          {weather.condition.toLowerCase()}
        </span>
      </div>
    </div>
  );
}
