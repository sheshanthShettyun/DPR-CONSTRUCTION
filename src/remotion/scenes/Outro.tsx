import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { inter, outfit } from "../fonts";
import { useFadeIn, useFadeUp } from "../transitions";
import { Logo } from "../components/Logo";

const tagline = ["Track.", "Manage.", "Progress."];

const TaglineWord = ({ word, index }: { word: string; index: number }) => {
  const anim = useFadeUp(38 + index * 13, 16);
  return (
    <span
      style={{
        fontFamily: outfit,
        fontWeight: 600,
        fontSize: 40,
        letterSpacing: "-0.01em",
        color: index === tagline.length - 1 ? COLORS.accent : COLORS.white,
        opacity: anim.opacity,
        transform: anim.transform,
      }}
    >
      {word}
    </span>
  );
};

export const Outro = () => {
  const frame = useCurrentFrame();
  const logo = useFadeUp(6, 24);
  const wordmark = useFadeUp(14, 18);
  const divider = useFadeIn(24, 12);
  const sub = useFadeIn(74, 12);
  const fadeToBlack = interpolate(frame, [140, 168], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: inter, backgroundColor: COLORS.bg, overflow: "hidden" }}>
      <img
        src={staticFile("hero-steel.jpg")}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.18,
          filter: "blur(6px) saturate(0.6)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 55% 45% at 50% 40%, rgba(226,241,166,0.07), transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(8,8,8,0.5), rgba(8,8,8,0.92) 85%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
        }}
      >
        <div style={{ opacity: logo.opacity, transform: logo.transform }}>
          <Logo size={92} color={COLORS.white} />
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: outfit,
            fontWeight: 600,
            fontSize: 58,
            letterSpacing: "0.32em",
            color: COLORS.white,
            opacity: wordmark.opacity,
            transform: wordmark.transform,
          }}
        >
          DPR CONSTRUCTION
        </h1>

        <div
          style={{
            width: 300,
            height: 1,
            backgroundColor: "rgba(226,241,166,0.25)",
            opacity: divider,
          }}
        />

        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          {tagline.map((word, i) => (
            <TaglineWord key={word} word={word} index={i} />
          ))}
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 17,
            fontWeight: 300,
            color: "rgba(255,255,255,0.6)",
            opacity: sub,
          }}
        >
          The operations management platform for modern construction.
        </p>
      </div>

      <div style={{ position: "absolute", inset: 0, backgroundColor: "#000000", opacity: fadeToBlack }} />
    </AbsoluteFill>
  );
};
