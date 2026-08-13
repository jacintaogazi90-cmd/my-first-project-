import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TalkingHead } from "./components/TalkingHead";
import { ProgressBar } from "./components/ProgressBar";
import { HookText, HOOK_DURATION } from "./components/HookText";
import { CTAText } from "./components/CTAText";
import { TOTAL_FRAMES } from "./constants";

export type ReelProps = {
  hookText: string;
  ctaText: string;
};

const CTA_DURATION = 95;
const CTA_FROM = TOTAL_FRAMES - CTA_DURATION;

export const Reel: React.FC<ReelProps> = ({ hookText, ctaText }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <TalkingHead />
      <ProgressBar />

      <Sequence durationInFrames={HOOK_DURATION} layout="none">
        <HookText text={hookText} />
      </Sequence>

      {ctaText ? (
        <Sequence from={CTA_FROM} durationInFrames={CTA_DURATION} layout="none">
          <CTAText text={ctaText} durationInFrames={CTA_DURATION} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
