import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { TOTAL_FRAMES } from "../constants";

/**
 * Thin playback-progress bar. Sits just above the bottom safe-zone line
 * (Instagram's own UI clears the outer 420px at the bottom / 120px on the
 * sides), so it stays visible instead of hiding behind platform chrome.
 */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const progress = Math.min(frame / TOTAL_FRAMES, 1);

  const trackLeft = 120;
  const trackWidth = width - 120 * 2;
  const bottomSafe = 420; // keep clear of platform UI
  const trackBottomOffset = bottomSafe + 40;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: trackLeft,
          bottom: trackBottomOffset,
          width: trackWidth,
          height: 4,
          borderRadius: 2,
          backgroundColor: "rgba(255,255,255,0.28)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            backgroundColor: "#ffffff",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
