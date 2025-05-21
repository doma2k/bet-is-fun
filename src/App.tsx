import { StrictMode } from "react";
import Provider from "./components/provider";
import GamblingGame from "./components/Home";

export default function App() {
  return (
    <StrictMode>
      <Provider>
        <GamblingGame />
      </Provider>
    </StrictMode>
  );
}
