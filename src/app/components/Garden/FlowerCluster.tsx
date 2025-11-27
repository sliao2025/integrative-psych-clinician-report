import React, { memo } from "react";
import GrassBlade from "./GrassBlade";
import GardenFlower from "./GardenFlower";

function FlowerCluster({
  colors = ["#f43f5e", "#e11d48", "#fb7185"],
  flip = false,
}: {
  colors?: string[];
  flip?: boolean;
}) {
  // Helper to safely pick a color even if the array has length 2 or 3.
  const c = (idx: number) =>
    colors[((idx % colors.length) + colors.length) % colors.length];

  const sizes = [22, 26, 30, 24];
  return (
    <div className={`flex items-end gap-2 ${flip ? "scale-x-[-1]" : ""}`}>
      <GrassBlade h={42} bend={8} />
      <GardenFlower size={sizes[0]} color={c(0)} tilt={-3} />
      <GrassBlade h={26} bend={8} />
      <GardenFlower size={sizes[2]} color={c(2)} tilt={-3} />
      <GrassBlade h={28} bend={4} />
      <GardenFlower size={sizes[2]} color={c(1)} tilt={2} />
      <GrassBlade h={24} bend={3} />
      <GardenFlower size={sizes[1]} color={c(3)} tilt={-1} />
    </div>
  );
}

export default memo(FlowerCluster);
