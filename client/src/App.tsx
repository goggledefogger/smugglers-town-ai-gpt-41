import React from "react";
import MapGame from "./MapGame";

export default function App() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-gray-900">
      {/* Map container (MapLibre/OSM tiles will render here) */}
      <div id="map" className="absolute inset-0 z-0" />
      {/* Game canvas overlay (Pixi.js will render here) */}
      <div id="game-canvas" className="absolute inset-0 z-10 pointer-events-none" />
      {/* HUD/UI can go here */}
      <div className="absolute top-4 left-4 z-20 text-white text-lg font-bold">
        Smuggler's Town MVP
      </div>
      {/* Map and game logic (map panning, car movement) */}
      <MapGame />
    </div>
  );
}
