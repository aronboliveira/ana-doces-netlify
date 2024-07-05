import {
  createContext,
  useReducer,
  // useEffect
} from "react";
import { Root } from "react-dom/client";
import { RootAction, voidishAppContext } from "src/declarations/types";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AnaDocesApp from "./AnaDocesApp";

export const AppContext = createContext<voidishAppContext>(undefined);

export default function AppProvider() {
  const rootReducer = (
    state: Map<string, Root>,
    action: RootAction
  ): Map<string, Root> => {
    switch (action.type) {
      case "SET_ROOT":
        const newState = new Map(state).set(action.id, action.root);
        return newState;
      default:
        console.warn(`!REDUCER: case defaulted. No root set.`);
        return state;
    }
  };
  const setRoot = async (id: string, root: Root): Promise<void> => {
    dispatchRoots({ type: "SET_ROOT", id, root });
  };
  const [rootsState, dispatchRoots] = useReducer(rootReducer, new Map());
  return (
    <AppContext.Provider value={{ rootsState, setRoot }}>
      <Router>
        <Routes>
          <Route path="*" element={<AnaDocesApp />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}
