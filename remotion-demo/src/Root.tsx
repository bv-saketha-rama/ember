import React from "react";
import { Composition } from "remotion";
import { Walkthrough, DURATION } from "./Walkthrough";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Walkthrough"
      component={Walkthrough}
      durationInFrames={DURATION}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
