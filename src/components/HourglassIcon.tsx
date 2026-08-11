"use client";

import Lottie from "lottie-react";
import animationData from "@/lib/hourglass-animation.json";

export default function HourglassIcon({ size = 170 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: size * 1.4, height: size * 1.4 }}
      />
    </div>
  );
}
