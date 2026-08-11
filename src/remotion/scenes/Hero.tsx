import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ArrowRight, BarChart3, Box, ChevronDown, MapPin, Truck } from "lucide-react";
import { COLORS } from "../theme";
import { inter, outfit } from "../fonts";
import { useFadeIn, useFadeUp } from "../transitions";

const features = [
  { icon: MapPin, label: "Real-time tracking" },
  { icon: Box, label: "Asset management" },
  { icon: Truck, label: "Fleet operations" },
  { icon: BarChart3, label: "Site insights" },
];

const navItems = ["Dashboard", "Fleet", "Assets", "Progress"];

export const Hero = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 130], [1.06, 1.16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nav = useFadeIn(0, 16);
  const headline = useFadeUp(10, 26);
  const sub = useFadeUp(24, 22);
  const cta = useFadeUp(36, 20);
  const featureRow = useFadeIn(50, 14);
  const chevron = useFadeIn(92, 10);

  return (
    <AbsoluteFill style={{ fontFamily: inter }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${staticFile("hero-steel.jpg")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(3.6px)",
          transform: `scale(${zoom})`,
        }}
      />
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(8,8,8,0.45)" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(8,8,8,0.5), transparent 35%, transparent 70%, rgba(8,8,8,0.85))",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 26,
          left: "50%",
          transform: "translateX(-50%)",
          width: "88%",
          maxWidth: 1180,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          borderRadius: 16,
          backgroundColor: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.06)",
          opacity: nav,
          fontFamily: inter,
        }}
      >
        <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: "-0.01em", color: "rgba(255,255,255,0.9)" }}>
          DPR Construction
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {navItems.map((item) => (
            <span
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                height: 34,
                padding: "0 14px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 110,
          maxWidth: 1180,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: outfit,
            fontWeight: 600,
            fontSize: 92,
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
            color: COLORS.white,
            textShadow: "0 0 80px rgba(0,0,0,0.4)",
            opacity: headline.opacity,
            transform: headline.transform,
          }}
        >
          Track with absolute
          <br />
          confidence
        </h1>

        <p
          style={{
            margin: "30px 0 0",
            maxWidth: 520,
            fontSize: 22,
            fontWeight: 300,
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.75)",
            opacity: sub.opacity,
            transform: sub.transform,
          }}
        >
          The operations management platform for modern construction. Track fleet, manage assets, and
          monitor site progress in real-time.
        </p>

        <div
          style={{
            marginTop: 42,
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: cta.opacity,
            transform: cta.transform,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              height: 52,
              padding: "0 28px",
              borderRadius: 12,
              backgroundColor: COLORS.white,
              color: "#000000",
              fontSize: 16,
              fontWeight: 600,
              fontFamily: inter,
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            Get Started
            <ArrowRight size={17} strokeWidth={2} />
          </div>
        </div>

        <div style={{ marginTop: 64, opacity: featureRow, fontFamily: inter }}>
          <div
            style={{
              width: 520,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.06)",
              marginBottom: 22,
            }}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            {features.map(({ icon: Icon, label }, i) => (
              <span key={label} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && (
                  <span
                    style={{
                      width: 1,
                      height: 14,
                      backgroundColor: "rgba(255,255,255,0.08)",
                      margin: "0 18px",
                    }}
                  />
                )}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    fontSize: 16,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  <Icon size={18} strokeWidth={1.6} />
                  {label}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 26,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: chevron,
        }}
      >
        <ChevronDown size={18} color="rgba(255,255,255,0.12)" strokeWidth={1.5} />
      </div>
    </AbsoluteFill>
  );
};
