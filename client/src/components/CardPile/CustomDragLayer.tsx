import type { CSSProperties, FC } from "react";
import type { XYCoord } from "react-dnd";
import { useDragLayer } from "react-dnd";

import { BoxDragPreview } from "./BoxDragPreview";
import { UICard } from "./interfaces";
import { ItemTypes } from "./ItemTypes";

const layerStyles: CSSProperties = {
  // position fixed roughly translates to top left is the browser window.
  // Assuming the co ordintaes of the cursor are also relative to browser window
  // this setting ensures that drag preview begins where the pointer is.
  // This is still subject to elment not being rotated
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  //width: "100%",
  //height: "100%",
};

function getItemStyles(
  item: UICard,
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    };
  }

  let { x, y } = currentOffset;

  //console.log(`rotate(${item.angle}deg) translate(${x}px, ${y}px)`);
  const transform = `translate(${x}px, ${y}px)`; // rotate(30deg)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

export interface CustomDragLayerProps {}

export const CustomDragLayer: FC<CustomDragLayerProps> = (props) => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      //initialOffset: monitor.getInitialClientOffset(),
      //currentOffset: monitor.getClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  function renderItem() {
    switch (itemType) {
      case ItemTypes.BOX:
        return (
          <BoxDragPreview
            title={item.title}
            angle={item.angle}
            classes={item.classes}
          />
        );
      default:
        return null;
    }
  }

  if (!isDragging) {
    return null;
  }
  console.log(`drging class=${item.classes}`);
  return (
    <div style={layerStyles}>
      <div
        className={item.classes}
        style={getItemStyles(item, initialOffset, currentOffset)}
      >
        {renderItem()}
      </div>
    </div>
  );
};
