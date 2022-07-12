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
}

export const Container: FC<ContainerProps> = ({ boxes, moveBox }) => {
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item: DragItem, monitor) {
        //console.log(`drop`);
        const delta = monitor.getDifferenceFromInitialOffset() as {
          x: number;
          y: number;
        };

        let left = Math.round(item.left + delta.x);
        let top = Math.round(item.top + delta.y);

        moveBox(item.id, left, top);
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
