import type { FC } from "react";
import { useCallback, useState } from "react";

import { Container } from "./DndContainer";
import { CustomDragLayer } from "./CustomDragLayer";
import { BoxMap } from "./interfaces";
import update from "immutability-helper";
import * as _ from "lodash";

const NUM_CARDS = 13;
const WIDTH = 600;
const HEIGHT = 600;
const CARD_HEIGHT = 328;
const CARD_WIDTH = 211;
const MIN_USEFUL_CARD_WIDTH = 20;
function getRandomCard(i: number, isHand: boolean): BoxMap[keyof BoxMap] {
  const top = isHand
    ? 10
    : 100 + Math.floor(Math.random() * (HEIGHT - CARD_HEIGHT)) / 4;
  const left = isHand
    ? i * MIN_USEFUL_CARD_WIDTH
    : 100 + Math.floor((Math.random() * (WIDTH - CARD_WIDTH)) / 4);
  const angle = isHand ? 0 : Math.floor(Math.random() * 180);
  const z = isHand ? left : i;
  const isJoker = Math.floor(Math.random() * 54) > 51;
  if (isJoker) {
    return { top, left, z, title: "J1", angle };
  }
  const suits = Array.from("CDHS");
  const ranks = Array.from("A23456789TJQK");
  const s = suits[Math.floor(Math.random() * suits.length)];
  const r = ranks[Math.floor(Math.random() * ranks.length)];

  const title = s + r;
  return { top, left, z, title, angle };
}

function reorgCardsToHand(boxes: BoxMap) {
  const sortedEntries = Object.entries(boxes).sort((a, b) =>
    a[1].left < b[1].left ? -1 : 1
  );
  let i = 0;
  sortedEntries.forEach((item) => {
    const [k, v] = item;
    //console.log(`changeing ${k}${JSON.stringify(v)}`);
    boxes[k].left = i * MIN_USEFUL_CARD_WIDTH;
    boxes[k].z = i;
    boxes[k].angle = 0;
    boxes[k].top = 0;
    i++;
  });
  //console.log(boxes);
  return boxes;
}

export const Pile: FC = () => {
  const [showHand, setShowHand] = useState(false);
  const [boxes, setBoxes] = useState<BoxMap>(
    _.range(NUM_CARDS).reduce(
      (o, key) => ({ ...o, [key]: getRandomCard(key, showHand) }),
      {}
    )
  );

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
      const newBoxes = update(boxes, {
        [id]: {
          $merge: { left, top },
        },
      });
      if (showHand) {
        reorgCardsToHand(newBoxes);
      }
      setBoxes(newBoxes);
    },
    [boxes, showHand]
  );

  const handleShowHandChange = useCallback(() => {
    // console.log(`handleShowHandChange`);
    const newShowHand = !showHand;
    setShowHand(newShowHand);
    if (newShowHand) {
      setBoxes(reorgCardsToHand(boxes));
    }
  }, [showHand, boxes]);

  return (
    // XXX
    <div style={{ width: WIDTH, height: HEIGHT }}>
      {/* <div> */}
      <Container boxes={boxes} moveBox={moveBox} />
      {/* 
      MRD
      This is if we we want a custome Drag preview while dragging*/}
      <CustomDragLayer />
      <p>
        <label htmlFor="showHand">
          <input
            id="showHand"
            type="checkbox"
            checked={showHand}
            onChange={handleShowHandChange}
          />
          <small>Show a ordered Hand rather than a Pile</small>
        </label>
      </p>
    </div>
  );
};
export default Pile;
