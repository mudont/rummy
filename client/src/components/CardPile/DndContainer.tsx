import type { CSSProperties, FC } from "react";
import { useDrop } from "react-dnd";

import { DraggableBox } from "./DraggableBox";
import type { BoxMap, DragItem } from "./interfaces";
import { ItemTypes } from "./ItemTypes";

const styles: CSSProperties = {
  width: "100%",
  height: "100%",
  //border: "1px solid black",
  position: "relative",
};

export interface ContainerProps {
  moveBox: Function;
  boxes: BoxMap;
  isHand: boolean;
  isDeck: boolean;
}

export const Container: FC<ContainerProps> = ({
  boxes,
  moveBox,
  isHand,
  isDeck,
}) => {
  const [, drop] = useDrop(
    () => ({
      accept: isHand
        ? [ItemTypes.HAND_CARD, ItemTypes.PILE_CARD, ItemTypes.DECK_CARD]
        : isDeck
        ? [ItemTypes.DECK_CARD]
        : [ItemTypes.HAND_CARD, ItemTypes.PILE_CARD],
      drop(item: DragItem, monitor) {
        //console.log(`drop ${JSON.stringify(item)}`);
        const delta = monitor.getDifferenceFromInitialOffset() as {
          x: number;
          y: number;
        };

        let left = Math.round(item.left + delta.x);
        let top = Math.round(item.top + delta.y);

        moveBox(item, isHand, isDeck, left, top);
        return undefined;
      },
    }),
    [moveBox]
  );

  return (
    <div className={"Container"} ref={drop} style={styles}>
      {Object.keys(boxes).map((key) => (
        <DraggableBox
          key={key}
          id={key}
          isHand={isHand}
          isDeck={isDeck}
          {...(boxes[key] as {
            top: number;
            left: number;
            z: number;
            title: string;
            angle: number;
            classes: string;
          })}
        />
      ))}
    </div>
  );
};
