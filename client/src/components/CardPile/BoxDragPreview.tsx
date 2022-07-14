import type { CSSProperties, FC } from "react";
import { memo, useEffect, useState } from "react";

import { Box } from "./Box";
const CARD_SCALE = 1.0;
const styles = (angle: number): CSSProperties => {
  return {
    display: "inline-block",
    zIndex: 10000,
    transform: `scale(${CARD_SCALE}) rotate(${angle}deg)`,
    WebkitTransform: `scale(${CARD_SCALE}) rotate(${angle}deg)`,
  };
};

export interface BoxDragPreviewProps {
  title: string;
  angle: number;
  classes: string;
}

export interface BoxDragPreviewState {
  tickTock: any;
}

export const BoxDragPreview: FC<BoxDragPreviewProps> = memo(
  function BoxDragPreview({ title, angle, classes }) {
    const [tickTock, setTickTock] = useState(false);
    console.log(`preview ${title}`);
    useEffect(
      function subscribeToIntervalTick() {
        const interval = setInterval(() => setTickTock(!tickTock), 500);
        return () => clearInterval(interval);
      },
      [tickTock]
    );

    return (
      <div style={styles(angle)}>
        <Box classes={classes} title={title} yellow={tickTock} preview />
      </div>
    );
  }
);
