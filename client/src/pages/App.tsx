import "./App.css";
import Pile from "../components/CardPile/Pile";
//import { DragDropContext } from "react-dnd";
//import MouseBackend from "react-dnd-mouse-backend";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

//import {MultiBackend} from "react-dnd-multi-backend";
//import { MultiBackend, DndProvider } from 'react-dnd-multi-backend'
//import { HTML5toTouch } from 'rdndmb-html5-to-touch'
function App() {
  return (
    <div className="App">
      {/*<DndProvider options={HTML5toTouch}>*/}
      <DndProvider
        backend={
          window.location.hostname.startsWith("m.")
            ? TouchBackend
            : HTML5Backend
        }
      >
        <Pile />
      </DndProvider>
    </div>
  );
}

export default App;
