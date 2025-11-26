import GardenFlower from "./GardenFlower";

export default function VinesTop() {
  // Minimal top-corner accents to frame upper area
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-0"
      aria-hidden={true}
    >
      <div
        className="absolute left-0 top-0 p-2 garden-drift"
        style={{ animationDuration: "18s" }}
      >
        <GardenFlower size={22} color="#86efac" tilt={-8} seed="vine-tl" />
      </div>
      <div
        className="absolute left-[9%] top-2 hidden sm:block p-2 garden-drift"
        style={{ animationDuration: "22s", animationDelay: "-6s" }}
      >
        <GardenFlower size={20} color="#a7f3d0" tilt={-4} seed="vine-tl-2" />
      </div>
      <div
        className="absolute right-0 top-0 p-2 garden-drift"
        style={{ animationDuration: "19s" }}
      >
        <GardenFlower size={22} color="#86efac" tilt={7} seed="vine-tr" />
      </div>
      <div
        className="absolute right-[10%] top-3 hidden sm:block p-2 garden-drift"
        style={{ animationDuration: "23s", animationDelay: "-8s" }}
      >
        <GardenFlower size={20} color="#a7f3d0" tilt={5} seed="vine-tr-2" />
      </div>
    </div>
  );
}
