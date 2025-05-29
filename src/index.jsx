import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BeatPlayerContextProvider } from "./store/beatPlayerContext";
import { ModalContextProvider } from "./store/modalContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ModalContextProvider>
      <BeatPlayerContextProvider>
        <App />
      </BeatPlayerContextProvider>
    </ModalContextProvider>
  </React.StrictMode>
);

