import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Series,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { CUT_BOUNDARIES, SOURCE_SEGMENTS, TOTAL_FRAMES } from "../constants";

/**
 * The edited talking-head footage: source segments played back to back
 * (dead air trimmed), a slow continuous Ken Burns push-in over the whole
 * duration, and a quick punch/flash at every jump cut so the trims read as
 * an intentional edit instead of a stutter.
 *
 * Source video is 576x1024 -- the same aspect ratio as the 1080x1920
 * output (0.5625), so `objectFit: cover` here is a straight uniform
 * scale-up with no cropping.
 */
export const TalkingHead: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow, continuous zoom across the entire piece -- keeps the frame alive
  // without calling attention to itself.
  const zoom = interpolate(frame, [0, TOTAL_FRAMES], [1, 1.09], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Distance to the nearest cut boundary, used for the punch-in flash.
  const distanceToCut = Math.min(
    ...CUT_BOUNDARIES.map((b) => Math.abs(frame - b)),
  );
  const punch = interpolate(distanceToCut, [0, 4], [1.035, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flashOpacity = interpolate(distanceToCut, [0, 2.5], [0.28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${zoom * punch})`,
          filter: "contrast(1.05) saturate(1.08)",
        }}
      >
        <Series>
          {SOURCE_SEGMENTS.map((segment, i) => (
            <Series.Sequence
               
              key={i}
              durationInFrames={segment.endAt - segment.startFrom}
              layout="none"
            >
              <OffthreadVideo
                src={staticFile("source.mp4")}
                startFrom={segment.startFrom}
                endAt={segment.endAt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Series.Sequence>
          ))}
        </Series>
      </AbsoluteFill>

      {/* Cut-punch flash */}
      <AbsoluteFill
        style={{
          backgroundColor: "#ffffff",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Cinematic top/bottom gradient for text legibility */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.45) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
