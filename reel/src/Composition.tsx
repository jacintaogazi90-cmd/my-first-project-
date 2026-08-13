import { Composition } from "remotion";
import { Reel } from "./Reel";
import { TOTAL_FRAMES } from "./constants";

export const RemotionComposition = () => {
  return (
    <Composition
      id="Reel"
      component={Reel}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        // PLACEHOLDER -- swap for the real hook/CTA copy before rendering.
        hookText: "YOUR HOOK LINE HERE",
        ctaText: "YOUR CLOSING LINE HERE",
      }}
    />
  );
};
