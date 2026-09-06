"use client";

import React from "react";

interface HCFTLWordmarkProps {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "silver" | "monochrome" | "cyan-accent";
  className?: string;
  showSubtitle?: boolean;
}

export function HCFTLWordmark({
  size = "md",
  variant = "silver",
  className = "",
  showSubtitle = false,
}: HCFTLWordmarkProps) {
  // Height configurations
  const heightMap = {
    xs: 14,
    sm: 18,
    md: 24,
    lg: 32,
  };

  const h = heightMap[size];
  const w = Math.round(h * 4.8); // Aspect ratio ~4.8

  const fillColor = variant === "monochrome" ? "currentColor" : "url(#hcftlSilver)";

  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <div className="flex items-center gap-2">
        <svg
          width={w}
          height={h}
          viewBox="0 0 160 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="HCFTL Wordmark"
          role="img"
          className="shrink-0"
        >
          <defs>
            {/* Metallic Silver Gradient */}
            <linearGradient id="hcftlSilver" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#F0F2ED" />
              <stop offset="70%" stopColor="#D5DEE5" />
              <stop offset="100%" stopColor="#B5E1E7" />
            </linearGradient>

            {/* Subtle Metallic Drop Shadow */}
            <filter id="hcftlShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.5" />
            </filter>
          </defs>

          <g filter="url(#hcftlShadow)">
            {/* ── H ── */}
            <path
              d="M 6 4 H 11 V 13.5 H 23 V 4 H 28 V 28 H 23 V 18.5 H 11 V 28 H 6 Z"
              fill={fillColor}
            />

            {/* ── C ── */}
            <path
              d="M 58 9 C 55 5.2 49.5 4 44.5 4 C 33.5 4 32.5 12 32.5 16 C 32.5 20 33.5 28 44.5 28 C 49.5 28 55 26.8 58 23 L 54.5 19.5 C 52.5 21.8 49 23 44.5 23 C 38 23 38 18 38 16 C 38 14 38 9 44.5 9 C 49 9 52.5 10.2 54.5 12.5 Z"
              fill={fillColor}
            />

            {/* ── F ── */}
            <path
              d="M 66 4 H 87 V 9 H 71.5 V 13.5 H 84 V 18.5 H 71.5 V 28 H 66 Z"
              fill={fillColor}
            />

            {/* ── T ── */}
            <path
              d="M 92 4 H 114 V 9 H 105.5 V 28 H 100.5 V 9 H 92 Z"
              fill={fillColor}
            />

            {/* ── L ── */}
            <path
              d="M 120 4 H 125.5 V 23 H 141 V 28 H 120 Z"
              fill={fillColor}
            />

            {/* Distinct Cyan Research Node Accent */}
            <circle
              cx="149"
              cy="25.5"
              r="2.5"
              fill="#7DD3FC"
              className={variant === "monochrome" ? "opacity-75" : "opacity-100"}
            />
          </g>
        </svg>
      </div>

      {showSubtitle && (
        <span className="font-mono text-[9px] tracking-[0.25em] text-[#ADBAC5] uppercase mt-1">
          Human Centered Frontier Technology Lab
        </span>
      )}
    </div>
  );
}
