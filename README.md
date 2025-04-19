# Smuggler's Town – Real-World Map CTF Racer

A browser-based, top-down "capture-the-flag" car-combat game on a real-world map. Built for instant-play, low-latency multiplayer fun.

## Monorepo Structure

```
smugglers-town-ai-gpt-41/
  client/      # Vite + React + Pixi.js + Zustand + Tailwind
  server/      # Node.js + Colyseus + zod
  shared/      # (optional, for types/schemas)
  TASKS.md
  README.md
```

## Quickstart

### Prerequisites
- Node.js 20+
- npm 9+ (or yarn/pnpm)

### 1. Install dependencies
```sh
cd client && npm install
cd ../server && npm install
```

### 2. Run the server
```sh
cd server
npm run dev
```

### 3. Run the client
```sh
cd client
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:2567 (Colyseus)

## MVP Gameplay Loop
- Drive a car on a real-world map (MapLibre/OSM tiles)
- Pick up contraband, deliver to base
- Server-authoritative physics and scoring
- Low-latency multiplayer via Colyseus

## Architecture
- **Client**: React SPA, Pixi.js overlay for game canvas, Zustand for state, Tailwind for UI
- **Server**: Node.js, Colyseus for real-time rooms, zod for schema validation
- **Data flow**: Client sends input diffs, server simulates and broadcasts state, client interpolates and renders
- **World model**: Meter-based coordinates, converted to lat/lng for map overlay

See `TASKS.md` for implementation plan and progress.
