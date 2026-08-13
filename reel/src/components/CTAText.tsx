import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_FAMILY } from "../constants";

/**
 * Closing call-to-action / payoff line. Lives inside a <Sequence> in the
 * parent so `frame` here is local to its own window.
 */
export const CTAText: React.FC<{ text: string; durationInFrames: number }> = ({
  text,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 210, mass: 0.6 },
  });
  const opacity = interpolate(
    frame,
    [0, 12, durationInFrames - 10, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const translateY = interpolate(entrance, [0, 1], [18, 0]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          bottom: 560,
          left: 120,
          width: width - 120 * 2,
          opacity,
          transform: `translateY(${translateY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 40,
            fontWeight: 500,
            lineHeight: 1.25,
            color: "#ffffff",
            textShadow: "0 2px 14px rgba(0,0,0,0.5)",
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
