import "./App.css";
import Pile from "../components/CardPile/Pile";
//import { DragDropContext } from "react-dnd";
//import MouseBackend from "react-dnd-mouse-backend";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { B1, B2, SA } from "components/cards";

import cardsMap from "../components//CardPile/cardsMap";
import { getRandomCard } from "../lib/cards";
import { FC } from "react";
//import {MultiBackend} from "react-dnd-multi-backend";
//import { MultiBackend, DndProvider } from 'react-dnd-multi-backend'
//import { HTML5toTouch } from 'rdndmb-html5-to-touch'

function App() {
  const WCJoker: FC = cardsMap[getRandomCard()];
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
        <div
          className="flex grid-flow-row gap-4 grid-cols-3"
          style={{
            height: "125px",
            background: "green",
          }}
        >
          {/* <div> Sri</div>
          <B1 style={{ transform: "scale(0.25)" }} /> */}
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
                }}
              >
                <WCJoker />
              </div>
              <p
                className="text-2xl text-yellow-400 w-72"
                style={{ position: "absolute", top: 50, left: "10px" }}
              >
                ← Wildcard Joker
              </p>
            </div>
            <div
              className="flex grid-flow-row"
              style={{
                position: "absolute",
                top: "0px",
                left: "30px",
                zIndex: "2",
              }}
            >
              <div
                style={{
                  transformOrigin: "top left",
                  transform: "scale(0.25)",
                }}
              >
                <B2 />
              </div>

              <p
                className="text-2xl text-yellow-400 w-72"
                style={{ position: "absolute", left: "10px" }}
              >
                ← Remaining Deck
              </p>
            </div>
          </div>
        </div>

        <div style={{ background: "red", height: "1px" }}> </div>
        <div className="flex grid-flow-row" style={{ background: "green" }}>
          <p
            className="text-2xl text-yellow-400 w-72"
            style={{ position: "absolute", left: "10px" }}
          >
            Discarded pile ↓
          </p>
          <Pile isHand={false} />
        </div>
        <div
          className="flex grid-flow-row"
          style={{
            height: "130px",
            position: "relative",
          }}
        >
          <p
            className="text-2xl text-red-800 w-72"
            style={{ position: "absolute", top: "0px", left: "10px" }}
          >
            Your Hand ↓
          </p>
          <div style={{ position: "absolute", bottom: "0px", left: "10px" }}>
            <Pile isHand={true} />
          </div>
        </div>
      </DndProvider>
    </div>
  );
}

export default App;
