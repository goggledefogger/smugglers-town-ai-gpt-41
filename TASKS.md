# Smuggler's Town – Dependency & Task Management

## Dependency Management (as of June 2024)

This project uses the latest stable versions of all core dependencies. See below for recommended versions and usage notes. Update regularly for security and new features.

### Core Frontend
- **React**: 19.x ([React 19 Release Notes](https://react.dev/blog/2024/04/25/react-19))
- **Vite**: 5.x
- **TypeScript**: 5.x
- **Tailwind CSS**: 3.x
- **Pixi.js**: 8.x (if chosen)
- **Phaser**: 3.x (if chosen)
- **React Router**: 6.x
- **Zustand**: 4.x
- **React Query**: 5.x

### Backend & Realtime
- **Node.js**: 20.x (LTS)
- **Colyseus**: 0.15.x
- **Firebase**: 10.x (modular SDK)
  - **Firestore**: 10.x
  - **Auth**: 10.x
  - **Cloud Functions**: 10.x
- **protobufjs**: 7.x (or latest)
- **zod**: 3.x

### Observability & CI/CD
- **Sentry**: 7.x (browser SDK)
- **GitHub Actions**: Use latest runners (ubuntu-latest, node-20)
- **Google Cloud Run**: Deploy Node 20 container images

### Fonts
- **Source Sans Pro**: [Google Fonts](https://fonts.google.com/specimen/Source+Sans+Pro)
- **Roboto Mono**: [Google Fonts](https://fonts.google.com/specimen/Roboto+Mono)

### Other
- **Map rendering**: Use open-licensed providers (e.g., MapLibre, OpenStreetMap, Mapbox GL JS)

---

## Completed Tasks
- [x] Documented dependency versions and upgrade notes
- [x] Integrate map rendering and game canvas (MapLibre + PixiJS v8, car and crosshair visible, correct API)
- [x] Fix car movement and map panning/rotation logic so that in both car-fixed and car-rotates modes, the car moves and the map pans/rotates as expected (screen/world alignment, PixiJS v8 rendering, and user controls all correct)

## In Progress Tasks
- [ ] Set up project with above dependencies and verify compatibility
- [ ] Implement MVP gameplay loop and networking
- [ ] Set up CI/CD pipeline (GitHub Actions, Cloud Run)
- [ ] Refactor map/game logic into modular components after MVP is working (see @task-list.mdc for best practices; initial implementation will use a single MapGame.tsx for rapid prototyping)

## Future Tasks
- [ ] Add advanced game features (AI, bots, PvP, etc.)
- [ ] Implement observability (Sentry, Cloud Logging)
- [ ] Optimize for mobile and accessibility
- [ ] Regularly audit and update dependencies

## Implementation Plan
- Use the latest stable versions for all dependencies (see above).
- Prefer modular imports (e.g., Firebase v10+ modular SDK).
- Use React 19 features (Actions, useOptimistic, etc.) where beneficial.
- Keep dependencies up to date with `npm outdated` and Dependabot.
- Document any breaking changes or upgrade steps in this file.
- **PixiJS v8 migration:** Use `.stroke({ ... })` and `.fill({ ... })` instead of deprecated `.lineStyle()` and `.beginFill()` APIs. See MapGame.tsx for correct usage. Car and crosshair are now visible and styled as intended.

### Relevant Files
- `package.json` – Dependency versions
- `vite.config.ts` – Vite setup
- `tailwind.config.js` – Tailwind CSS config
- `src/` – Main app code (React, Zustand, etc.)
- `.github/workflows/` – GitHub Actions CI/CD
- `firebase.json`, `firestore.rules` – Firebase config

---

## References
- [React 19 Release Notes](https://react.dev/blog/2024/04/25/react-19)
- [Vite Docs](https://vitejs.dev/)
- [Pixi.js Docs](https://pixijs.com/)
- [Phaser Docs](https://phaser.io/)
- [Colyseus Docs](https://docs.colyseus.io/)
- [Firebase Modular SDK](https://firebase.google.com/docs/web/modular-upgrade)
- [Tailwind CSS Docs](https://tailwindcss.com/docs/installation)
- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React Query Docs](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Sentry JS SDK](https://docs.sentry.io/platforms/javascript/)
- [Google Cloud Run](https://cloud.google.com/run/docs)
- [GitHub Actions](https://docs.github.com/en/actions)
