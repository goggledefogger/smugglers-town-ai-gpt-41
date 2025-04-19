import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// TODO: Initialize MapLibre in #map and Pixi.js in #game-canvas after mount

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
