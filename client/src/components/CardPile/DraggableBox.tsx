import type { CSSProperties, FC } from "react";
import { memo, useEffect } from "react";
import type { DragSourceMonitor } from "react-dnd";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Box } from "./Box";
import { ItemTypes } from "./ItemTypes";

function getStyles(
  left: number,
  top: number,
  z: number,
  isDragging: boolean,
  angle: number
): CSSProperties {
  const transform = `translate3d(${left}px, ${top}px, 0) rotate(${angle}deg)`;
  return {
    // left,
    // top,
    position: "absolute",
    transform,
    WebkitTransform: transform,
    // IE fallback: hide the real node using CSS when dragging
    // because IE will ignore our custom "empty image" drag preview.
    opacity: isDragging ? 0.3 : 1,
    //height: isDragging ? "" : "",
    zIndex: z,
  };
}

export interface DraggableBoxProps {
  id: string;
  title: string;
  left: number;
  top: number;
  z: number;
  angle: number;
  classes: string;
}

export const DraggableBox: FC<DraggableBoxProps> = memo(function DraggableBox(
  props
) {
  const { id, title, left, z, top, angle, classes } = props;
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { id, left, top, title, angle, z, classes },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top, title, angle, z]
  );

  // MRD XXX uncomment if we wnt a custome drag layer and
  // don't want the HTML5 preview
  // This code seems to show an empty image
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  // XXX
  // CSS issue: Draggable box is to left and higher than Box
  // Draggable box is the size of a card but Box tiny
  // The SVG under it is big a
  return (
    <div
      onClick={() => console.log(`clicked: ${id} : ${title}`)}
      // className={classes}
      ref={drag}
      style={getStyles(left, top, z, isDragging, angle)}
      role="DraggableBox"
    >
      <div>
        <Box classes={classes} title={title} />
      </div>
    </div>
  );
});
