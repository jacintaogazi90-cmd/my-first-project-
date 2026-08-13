import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_FAMILY } from "../constants";

const DURATION = 60; // ~2s -- on screen within the first half-second, holds, then clears

export const HOOK_DURATION = DURATION;

/**
 * The hook: readable and specific on screen inside the first half-second.
 * Lives inside a <Sequence from={0} durationInFrames={HOOK_DURATION}> in the
 * parent so `frame` here is already local (0 at the very start).
 */
export const HookText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 210, mass: 0.6 },
  });
  const opacity = interpolate(frame, [DURATION - 18, DURATION], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(entrance, [0, 1], [24, 0]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 120,
          width: width - 120 * 2,
          opacity,
          transform: `translateY(${translateY}px) scale(${0.94 + entrance * 0.06})`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 64,
            fontWeight: 600,
            lineHeight: 1.15,
            color: "#ffffff",
            textShadow: "0 2px 18px rgba(0,0,0,0.5)",
            textAlign: "left",
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
