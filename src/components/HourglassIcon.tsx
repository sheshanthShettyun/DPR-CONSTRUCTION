"use client";

import Lottie from "lottie-react";
import animationData from "@/lib/hourglass-animation.json";

export default function HourglassIcon({ size = 200 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: size, height: size }}
      />
    </div>
  );
}
