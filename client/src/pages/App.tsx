import "./App.css";
import Pile from "../components/CardPile/Pile";
//import { DragDropContext } from "react-dnd";
//import MouseBackend from "react-dnd-mouse-backend";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { B1, B2, SA } from "components/cards";
import _ from "lodash";
import cardsMap from "../components//CardPile/cardsMap";
import { FC } from "react";
//import {MultiBackend} from "react-dnd-multi-backend";
//import { MultiBackend, DndProvider } from 'react-dnd-multi-backend'
//import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import * as R from "ramda";
import { useCallback, useState } from "react";

import { BoxMap, UICard } from "../components/CardPile/interfaces";
import { getRandomCard } from "../lib/cards";
import Deck from "components/CardPile/Deck";
import moveCard from "lib/moveCard";
const NUM_CARDS = 13;
const CARD_HEIGHT = 328;
const CARD_WIDTH = 211;
const MIN_USEFUL_CARD_WIDTH = 20;

function getRandomCardData(
  id: number,
  isHand: boolean,
  totalCards: number
): BoxMap[keyof BoxMap] {
  const top = isHand ? 10 : 25 + Math.floor(Math.random() * CARD_HEIGHT) / 4;
  const left = isHand
    ? id * MIN_USEFUL_CARD_WIDTH
    : 50 + Math.floor((Math.random() * CARD_WIDTH) / 4);
  const angle = isHand ? 0 : Math.floor(Math.random() * 180);
  const z = isHand ? Math.floor(left / 10) : id;
  const isJoker = Math.floor(Math.random() * 54) > 51;
  let classes: string = "";
  if (id === totalCards - 1 && !isHand) {
    classes = "border-solid border-2 border-red-600";
  }
  if (isJoker) {
    return {
      top,
      left,
      z,
      title: "J1",
      angle,
      classes,
      isHand,
      id,
      isDeck: false,
    };
  }

  const title = getRandomCard();
  return { top, left, z, title, angle, classes, isHand, isDeck: false, id };
}

function reorgCardsToDeck(boxes: BoxMap) {
  const sortedEntries = Object.entries(boxes).sort((a, b) =>
    a[1].left < b[1].left ? -1 : 1
  );
  let i = 0;
  sortedEntries.forEach((item) => {
    const [k, v] = item;
    //console.log(`changeing ${k}${JSON.stringify(v)}`);
    boxes[k].left = i / 6;
    boxes[k].z = i;
    boxes[k].angle = 0;
    boxes[k].top = i / 6;
    boxes[k].isHand = false;
    boxes[k].isDeck = true;
    i++;
  });
  //console.log(boxes);
  return boxes;
}

function makePile(numCards: number, isHand: boolean): BoxMap {
  return _.range(numCards).reduce(
    (o, key) => ({ ...o, [key]: getRandomCardData(key, isHand, numCards) }),
    {}
  );
}

const HAND = makePile(NUM_CARDS, true);
const PILE = makePile(NUM_CARDS, false);
const DECK = makePile(NUM_CARDS * 3, true);
reorgCardsToDeck(DECK);

//----------------------------------------------------
// App component
function App() {
  const [hand, setHand] = useState<BoxMap>(HAND);
  const [pile, setPile] = useState<BoxMap>(PILE);
  const [deck, setDeck] = useState<BoxMap>(DECK);

  const nHand = Object.keys(hand).length;
  const nPile = Object.keys(pile).length;
  const moveBox = useCallback(
    (
      item: UICard,
      isTargetHand: boolean,
      isTargetDeck: boolean,
      left: number,
      top: number
    ) => {
      const [h, p, d] = moveCard(
        hand,
        pile,
        deck,
        item,
        isTargetHand,
        isTargetDeck,
        left,
        top
      );
      setHand(h);
      setPile(p);
      setDeck(d);
    },
    [hand, pile, deck]
  );

  return (
    <div className="App" style={{ height: "100vh", background: "#E59866" }}>
      {/*<DndProvider options={HTML5toTouch}>*/}
      <DndProvider
        backend={
          window.location.hostname.startsWith("m.")
            ? TouchBackend
            : HTML5Backend
        }
      >
        <div className="flex gap-16" style={{ height: "120px" }}>
          <div className="flex flex-col" style={{ position: "relative" }}></div>
          {["Arun", "Sri", "Ramu"].map((p) => (
            <div className="flex flex-col" style={{ position: "relative" }}>
              <div className="flex-initial w-14 h-24">
                <span className="text-2xl">{p}</span>
              </div>
              <B2
                style={{
                  position: "absolute",
                  top: "30px",
                  left: "0px",
                  zIndex: "1",
                  transformOrigin: "top left",
                  transform: "scale(0.25)",
                }}
              />
            </div>
          ))}
        </div>

        <Deck deck={deck} moveBox={moveBox}></Deck>
        <div style={{ background: "red", height: "1px" }}> </div>
        <div
          className="DiscardedPile flex grid-flow-row"
          style={{ background: "green" }}
        >
          <p
            className="text-2xl text-yellow-400 w-72"
            style={{ position: "absolute", left: "10px" }}
          >
            Discarded pile ({nPile} cards) ↓
          </p>
          <Pile isHand={false} boxes={pile} moveBox={moveBox} />
        </div>
        <div
          className="PlayerHand flex grid-flow-row"
          style={{
            height: "130px",
            position: "relative",
          }}
        >
          <p
            className="text-2xl text-red-800 w-72"
            style={{ position: "absolute", top: "0px", left: "10px" }}
          >
            <span> Your Hand </span>
            <span className={nHand === 13 ? "" : "animate-ping text-slate-900"}>
              {" "}
              ({nHand} cards)
            </span>
            ↓
          </p>
          <div
            style={{
              position: "absolute",
              bottom: "0px",
              left: "10px",
              width: "100%",
              height: "80%",
            }}
          >
            <Pile isHand={true} boxes={hand} moveBox={moveBox} />

            <div style={{ background: "red", height: "1px" }}> </div>
          </div>
        </div>
      </DndProvider>
    </div>
  );
}

export default App;
