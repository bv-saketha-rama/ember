"use client";

import { Player } from "@remotion/player";
import {
  HowItWorks,
  HOWITWORKS_DURATION,
  HOWITWORKS_FPS,
  HOWITWORKS_W,
  HOWITWORKS_H,
} from "./remotion/HowItWorks";

// The interactive, in-browser product walkthrough. @remotion/player renders the
// same composition used for the marketing video, but here the user can play,
// pause, and scrub through the four steps at their own pace.
export function DemoPlayer() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-border shadow-2xl"
      style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}
    >
      <Player
        component={HowItWorks}
        durationInFrames={HOWITWORKS_DURATION}
        fps={HOWITWORKS_FPS}
        compositionWidth={HOWITWORKS_W}
        compositionHeight={HOWITWORKS_H}
        style={{ width: "100%" }}
        controls
        loop
        autoPlay
        // Autoplay must be muted-equivalent; there's no audio, but this keeps
        // browsers from blocking the start.
        initiallyMuted
        clickToPlay
        doubleClickToFullscreen
      />
    </div>
  );
}
