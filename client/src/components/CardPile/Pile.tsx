import type { FC } from "react";
import { useCallback, useState } from "react";

import { Container } from "./DndContainer";
import { CustomDragLayer } from "./CustomDragLayer";
import { BoxMap } from "./interfaces";
import update from "immutability-helper";
import * as _ from "lodash";
import R from "ramda";
import { getRandomCard } from "../../lib/cards";
const NUM_CARDS = 13;
const HEIGHT_HAND = "100px";
const HEIGHT_PILE = 200;
const CARD_HEIGHT = 328;
const CARD_WIDTH = 211;
const MIN_USEFUL_CARD_WIDTH = 20;

function getRandomCardData(
  i: number,
  isHand: boolean,
  totalCards: number
): BoxMap[keyof BoxMap] {
  const top = isHand ? 10 : 25 + Math.floor(Math.random() * CARD_HEIGHT) / 4;
  const left = isHand
    ? i * MIN_USEFUL_CARD_WIDTH
    : 50 + Math.floor((Math.random() * CARD_WIDTH) / 4);
  const angle = isHand ? 0 : Math.floor(Math.random() * 180);
  const z = isHand ? Math.floor(left / 10) : i;
  const isJoker = Math.floor(Math.random() * 54) > 51;
  let classes: string = "";
  if (i === totalCards - 1 && !isHand) {
    classes = "border-solid border-2 border-red-600";
  }
  if (isJoker) {
    return { top, left, z, title: "J1", angle, classes };
  }

  const title = getRandomCard();
  return { top, left, z, title, angle, classes };
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
interface IProps {
  isHand: boolean;
}

function makePile(numCards: number, isHand: boolean): BoxMap {
  return _.range(numCards).reduce(
    (o, key) => ({ ...o, [key]: getRandomCardData(key, isHand, numCards) }),
    {}
  );
}
export const Pile: FC<IProps> = ({ isHand }) => {
  const [boxes, setBoxes] = useState<BoxMap>(makePile(NUM_CARDS, isHand));

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
      const newBoxes = update(boxes, {
        [id]: {
          $merge: { left, top },
        },
      });
      if (isHand) {
        reorgCardsToHand(newBoxes);
      }
      setBoxes(newBoxes);
    },
    [boxes, isHand]
  );

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
      <Container boxes={boxes} moveBox={moveBox} />
      {/* 
      MRD
      This is if we we want a custome Drag preview while dragging*/}
      <CustomDragLayer />
    </div>
  );
};
export default Pile;
