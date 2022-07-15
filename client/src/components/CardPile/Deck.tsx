import type { FC } from "react";
import { Container } from "./DndContainer";
import { CustomDragLayer } from "./CustomDragLayer";
import { BoxMap } from "./interfaces";
import cardsMap from "./cardsMap";
import { getRandomCard } from "../../lib/cards";

const WCJoker: FC = cardsMap[getRandomCard()];

interface IDeckProps {
  deck: BoxMap;
  moveBox: Function;
}

const Deck: FC<IDeckProps> = ({ deck, moveBox }) => {
  return (
    // XXX
    <div
      className={"Deck flex grid-flow-row gap-4 grid-cols-3"}
      style={{
        width: "100%",
        height: "125px",
        background: "green",
      }}
    >
      {/* <div> */}

      <div style={{ position: "relative" }}>
        <div
          className="flex grid-flow-row"
          style={{
            position: "absolute",
            top: "30px",
            left: "0px",
            zIndex: "1",
          }}
        >
          <div
            style={{
              position: "absolute",
              transformOrigin: "top left",
              transform: "scale(0.25)",
              WebkitTransform: "scale(0.25)",
            }}
          >
            <WCJoker />
          </div>
          <p
            className="text-2xl text-yellow-400 w-72"
            style={{ position: "absolute", top: 60, left: "10px" }}
          >
            ← Wildcard Joker
          </p>
        </div>
        <div
          className="flex grid-flow-row"
          style={{
            position: "absolute",
            top: `0px`,
            left: `30px`,
            zIndex: "2",
          }}
        >
          <Container
            boxes={deck}
            moveBox={moveBox}
            isHand={false}
            isDeck={true}
          />
          <CustomDragLayer />
          <p
            className="text-2xl text-yellow-400 w-96"
            style={{ position: "absolute", left: "25px" }}
          >
            ← Remaining Deck({Object.keys(deck).length})
          </p>
        </div>
      </div>
    </div>
  );
};
export default Deck;
