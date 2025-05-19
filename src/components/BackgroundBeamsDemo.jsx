import React from "react";
import { BackgroundBeams } from "./ui/background-beams";
import { TypewriterEffectSmoothDemo } from "./TypewriterEffectSmoothDemo";

export function BackgroundBeamsDemo() {
  return (
    <div
      className="h-[100vh] mt-[-55px] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <TypewriterEffectSmoothDemo/>
      </div>
      <BackgroundBeams />
    </div>
  );
}
