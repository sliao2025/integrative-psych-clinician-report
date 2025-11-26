import React, { memo } from "react";
import GrassBlade from "./GrassBlade";
import GardenFlower from "./GardenFlower";

function FlowerCluster({
  colors = ["#f43f5e", "#e11d48", "#fb7185"],
  flip = false,
  seed,
}: {
  colors?: string[];
  flip?: boolean;
  seed: string;
}) {
  // Helper to safely pick a color even if the array has length 2 or 3.
  const c = (idx: number) =>
    colors[((idx % colors.length) + colors.length) % colors.length];

  const sizes = [22, 26, 30, 24];
  return (
    <div className={`flex items-end gap-2 ${flip ? "scale-x-[-1]" : ""}`}>
      <GrassBlade h={42} bend={8} seed={`${seed}-gb1`} />
      <GardenFlower
        size={sizes[0]}
        color={c(0)}
        tilt={-3}
        seed={`${seed}-gf1`}
      />
      <GrassBlade h={26} bend={8} seed={`${seed}-gb2`} />
      <GardenFlower
        size={sizes[2]}
        color={c(2)}
        tilt={-3}
        seed={`${seed}-gf2`}
      />
      <GrassBlade h={28} bend={4} seed={`${seed}-gb3`} />
      <GardenFlower
        size={sizes[2]}
        color={c(1)}
        tilt={2}
        seed={`${seed}-gf3`}
      />
      <GrassBlade h={24} bend={3} seed={`${seed}-gb4`} />
      <GardenFlower
        size={sizes[1]}
        color={c(3)}
        tilt={-1}
        seed={`${seed}-gf4`}
      />
    </div>
  );
}

export default memo(FlowerCluster);
