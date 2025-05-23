import App from "./App";
import { createRoot } from "react-dom/client";
import "./index.css";
import Provider from "./components/provider";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>
);
