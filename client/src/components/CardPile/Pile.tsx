import type { FC } from "react";
import { Container } from "./DndContainer";
import { CustomDragLayer } from "./CustomDragLayer";
import { BoxMap } from "./interfaces";
const HEIGHT_HAND = "100px";
const HEIGHT_PILE = 200;

interface IProps {
  isHand: boolean;
  boxes: BoxMap;
  moveBox: Function;
}

export const Pile: FC<IProps> = ({ isHand, boxes, moveBox }) => {
  const height = isHand ? HEIGHT_HAND : `${HEIGHT_PILE}px`;
  return (
    // XXX
    <div
      className={"Pile"}
      style={{
        height,
        width: "100%",
        background: isHand ? "#E59866" : "green",
      }}
    >
      {/* <div> */}
      <Container
        boxes={boxes}
        moveBox={moveBox}
        isHand={isHand}
        isDeck={false}
      />
      {/* 
      MRD
      This is if we we want a custome Drag preview while dragging*/}
      <CustomDragLayer />
    </div>
  );
};
export default Pile;
