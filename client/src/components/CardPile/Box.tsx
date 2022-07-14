import type { CSSProperties, FC } from "react";
import { memo } from "react";
import { cardsMap } from "./cardsMap";
const HEIGHT = 100;
const WIDTH = HEIGHT * 0.643;
const CARD_SCALE = 0.25;

const styles: CSSProperties = {
  //border: "0px dashed gray",
  padding: "0.5rem",
  cursor: "move",
  height: HEIGHT,
  width: WIDTH,
  transform: `scale(${CARD_SCALE})`,
  transformOrigin: `top left`,
};

export interface BoxProps {
  title: string;
  yellow?: boolean;
  preview?: boolean;
  classes: string;
}

export const Box: FC<BoxProps> = memo(function Box({
  title,
  yellow,
  preview,
  classes,
}) {
  const st = yellow
    ? { ...styles, backgroundColor: "yellow", padding: "0.5rem" }
    : styles;
  const Card: FC = cardsMap[title];
  console.log(`Box ${title} classes: ${classes}`);
  return (
    <div className={classes} style={st} role={preview ? "BoxPreview" : "Box"}>
      <Card />
    </div>
  );
});
