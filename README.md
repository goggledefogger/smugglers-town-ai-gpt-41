# Smuggler's Town – Real-World Map CTF Racer

A browser-based, top-down "capture-the-flag" car-combat game set on a real-world map. Built for instant-play, low-latency multiplayer fun using React, Pixi.js, and Colyseus.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Quickstart](#quickstart)
- [Usage](#usage)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Project Overview
Smuggler's Town is a multiplayer, real-time, capture-the-flag racing game. Players drive cars on a real-world map, pick up contraband, and race to deliver it to their base while avoiding or battling other players. The game is designed for fast, fun, and accessible play in the browser.

## Features
- Real-world map gameplay (MapLibre + OSM tiles)
- Fast-paced car physics and controls
- Capture-the-flag mechanics
- Server-authoritative multiplayer (Colyseus)
- Real-time car movement and state sync
- Modern, responsive UI (React + Tailwind)
- Pixi.js overlay for smooth 2D graphics

## Architecture
- **Client**: React SPA, Pixi.js for game rendering, Zustand for state, Tailwind for UI
- **Server**: Node.js, Colyseus for real-time rooms, zod for schema validation
- **Data flow**: Client sends input diffs, server simulates and broadcasts state, client interpolates and renders
- **World model**: Meter-based coordinates, converted to lat/lng for map overlay

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Pixi.js, Zustand, Tailwind CSS, MapLibre
- **Backend**: Node.js, Colyseus, zod
- **Other**: OpenStreetMap tiles, FastAPI (planned), Monorepo structure

## Folder Structure
```
smugglers-town-ai-gpt-41/
  client/      # Vite + React + Pixi.js + Zustand + Tailwind
  server/      # Node.js + Colyseus + zod
  shared/      # (optional, for types/schemas)
  TASKS.md     # Task list and implementation plan
  README.md    # Project documentation
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
- Server: ws://localhost:2567 (Colyseus)

## Usage
- Open the client in your browser.
- Use arrow keys or WASD to drive your car.
- Pick up contraband and deliver it to your base.
- Compete with other players in real time.

## Development
- See `TASKS.md` for the implementation plan and progress.
- Code style: React + TypeScript, Tailwind for UI, minimal dependencies.
- To add features or fix bugs, follow the task list and code preferences in the repo.

## Contributing
Pull requests and issues are welcome! Please:
- Follow the existing code style and structure
- Keep PRs focused and concise
- Update documentation as needed

## License
MIT License. See [LICENSE](LICENSE) for details.

## Contact
For questions, suggestions, or feedback, open an issue or contact the maintainer.
