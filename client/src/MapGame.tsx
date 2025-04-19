import { useEffect, useRef } from "react";

import maplibregl from "maplibre-gl";
import * as PIXI from "pixi.js";

const MAP_STYLE = "https://demotiles.maplibre.org/style.json";
const MAP_START = { lng: -74.006, lat: 40.7128, zoom: 12 }; // New York City, wider view
const CAR_SIZE = 32;
const ACCEL = 1000; // m/s^2 (exaggerated for debug)
const MAX_SPEED = 2000; // m/s (exaggerated for debug)
const TURN_RATE = 180; // deg/s
const DRAG = 1.5;

// Add driving mode toggle
const DRIVING_MODES = ["car-fixed", "car-rotates"] as const;
type DrivingMode = typeof DRIVING_MODES[number];
const drivingMode = { current: "car-fixed" as DrivingMode };

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export default function MapGame() {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const pixiAppRef = useRef<PIXI.Application | null>(null);

  // Car state (meters, heading in deg, velocity)
  const carState = useRef({
    x: 0,
    y: 0,
    heading: 0,
    speed: 0,
    turn: 0,
    throttle: 0,
    brake: 0,
  });

  // Input state
  const input = useRef({ up: false, down: false, left: false, right: false });

  useEffect(() => {
    let destroyed = false;
    // --- MapLibre Init ---
    const map = new maplibregl.Map({
      container: "map",
      style: MAP_STYLE,
      center: [MAP_START.lng, MAP_START.lat],
      zoom: MAP_START.zoom,
      interactive: false,
    });
    mapRef.current = map;

    // --- Pixi.js v8 Init (async) ---
    let pixiApp: PIXI.Application;
    let car: PIXI.Graphics;
    let canvasParent: HTMLElement | null = null;
    let canvas: HTMLCanvasElement | null = null;

    (async () => {
      pixiApp = new PIXI.Application();
      await pixiApp.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0,
        antialias: true,
        resizeTo: window,
      });
      if (destroyed) {
        await pixiApp.destroy(true, { children: true });
        return;
      }
      pixiAppRef.current = pixiApp;

      // Replace #game-canvas with Pixi's canvas
      canvas = pixiApp.canvas;
      canvasParent = document.getElementById("game-canvas")?.parentElement || null;
      const oldDiv = document.getElementById("game-canvas");
      if (oldDiv && canvasParent) {
        canvas.className = "absolute inset-0 z-10 pointer-events-none";
        canvas.style.position = "absolute";
        canvas.style.inset = "0";
        canvas.style.zIndex = "10";
        canvas.style.pointerEvents = "none";
        canvasParent.replaceChild(canvas, oldDiv);
      }

      // Car sprite (rectangle with pointed front)
      const CAR_WIDTH = CAR_SIZE * 0.6;
      const CAR_LENGTH = CAR_SIZE * 1.2;
      const bodyLeft = -CAR_WIDTH / 2;
      const bodyRight = CAR_WIDTH / 2;
      const bodyBack = CAR_LENGTH / 2;
      const bodyFront = -CAR_LENGTH / 2 + CAR_WIDTH * 0.4;
      const tipY = -CAR_LENGTH / 2;
      car = new PIXI.Graphics();
      // Draw car body (rectangle)
      car.rect(bodyLeft, bodyFront, CAR_WIDTH, CAR_LENGTH * 0.7)
         .fill(0xFF3333)
         .stroke({ width: 4, color: 0x000000 });
      // Draw pointed front (triangle)
      car.moveTo(bodyLeft, bodyFront)
         .lineTo(0, tipY)
         .lineTo(bodyRight, bodyFront)
         .lineTo(bodyLeft, bodyFront)
         .fill(0xFF3333)
         .stroke({ width: 4, color: 0x000000 });
      // Add a white crosshair for visibility
      car.moveTo(bodyLeft, 0)
         .lineTo(bodyRight, 0)
         .moveTo(0, bodyFront)
         .lineTo(0, bodyBack)
         .stroke({ width: 2, color: 0xffffff });
      // Add a debug arrow showing heading (from center to just beyond tip)
      car.moveTo(0, 0)
         .lineTo(0, tipY - CAR_SIZE * 0.3)
         .stroke({ width: 2, color: 0x00ff00 }); // green arrow
      car.zIndex = 1000;
      car.alpha = 1;
      pixiApp.stage.addChild(car);

      // Add debug label overlay to the DOM
      const debugLabelId = 'car-debug-label';
      let debugLabel = document.getElementById(debugLabelId);
      if (!debugLabel) {
        debugLabel = document.createElement('div');
        debugLabel.id = debugLabelId;
        debugLabel.style.position = 'absolute';
        debugLabel.style.top = '12px';
        debugLabel.style.right = '12px';
        debugLabel.style.zIndex = '10000';
        debugLabel.style.background = 'rgba(0,0,0,0.7)';
        debugLabel.style.color = '#0f0';
        debugLabel.style.fontFamily = 'monospace';
        debugLabel.style.fontSize = '16px';
        debugLabel.style.padding = '6px 12px';
        debugLabel.style.borderRadius = '8px';
        document.body.appendChild(debugLabel);
      }

      // --- Animation Loop ---
      let last = performance.now();
      function animate(now: number) {
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        // --- Car physics ---
        const state = carState.current;
        // Input to throttle/turn
        state.throttle = input.current.up ? 1 : 0;
        state.brake = input.current.down ? 1 : 0;
        state.turn = (input.current.left ? -1 : 0) + (input.current.right ? 1 : 0);
        // Turning
        if (state.turn !== 0) {
          state.heading += state.turn * TURN_RATE * dt;
        }
        // Acceleration
        const acc = state.throttle * ACCEL - state.brake * ACCEL * 0.7;
        state.speed += acc * dt;
        // Drag
        state.speed -= state.speed * DRAG * dt;
        // Clamp speed to zero if very small
        if (Math.abs(state.speed) < 0.1) state.speed = 0;
        // Clamp speed
        state.speed = Math.max(Math.min(state.speed, MAX_SPEED), -MAX_SPEED / 2);
        // Move
        // Movement (exaggerate speed for testing, if needed)
        const speed = state.speed * 10; // exaggerate here if you want
        let tempX = 0, tempY = 0;
        if (drivingMode.current === "car-fixed") {
          // Move in the direction of screen up, rotated by the map's bearing
          const bearingRad = degToRad(-state.heading + 180);
          tempX = Math.sin(bearingRad) * speed * dt;
          tempY = Math.cos(bearingRad) * speed * dt;
        } else {
          tempX = Math.sin(degToRad(state.heading)) * speed * dt;
          tempY = Math.cos(degToRad(state.heading)) * speed * dt;
        }
        state.x += tempX;
        state.y += tempY;
        // --- Map panning and rotation ---
        const metersPerDegLat = 111320;
        const metersPerDegLng = metersPerDegLat * Math.cos((MAP_START.lat * Math.PI) / 180);
        const lat = MAP_START.lat + state.y / metersPerDegLat;
        const lng = MAP_START.lng + state.x / metersPerDegLng;
        if (drivingMode.current === "car-fixed") {
          // Map bearing should be -state.heading + 180 so car always points up
          map.jumpTo({ center: [lng, lat], bearing: -state.heading + 180 });
          car.x = window.innerWidth / 2;
          car.y = window.innerHeight / 2;
          car.rotation = 0; // car always upright
        } else {
          map.jumpTo({ center: [lng, lat], bearing: 0 });
          car.x = window.innerWidth / 2;
          car.y = window.innerHeight / 2;
          car.rotation = degToRad(state.heading); // car rotates
        }
        // Next frame
        animationRef.current = requestAnimationFrame(animate);

        // Update debug label
        if (debugLabel) {
          debugLabel.textContent = `Heading: ${state.heading.toFixed(1)}°  |  Map bearing: ${drivingMode.current === "car-fixed" ? (-state.heading).toFixed(1) : '0.0'}°`;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    })();

    // --- Input Handling ---
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "w", "W"].includes(e.key)) input.current.up = true;
      if (["ArrowDown", "s", "S"].includes(e.key)) input.current.down = true;
      if (["ArrowLeft", "a", "A"].includes(e.key)) input.current.left = true;
      if (["ArrowRight", "d", "D"].includes(e.key)) input.current.right = true;
      if (e.key === "m" && !e.repeat) {
        // Toggle driving mode
        const idx = DRIVING_MODES.indexOf(drivingMode.current);
        drivingMode.current = DRIVING_MODES[(idx + 1) % DRIVING_MODES.length];
        console.log("Driving mode:", drivingMode.current);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (["ArrowUp", "w", "W"].includes(e.key)) input.current.up = false;
      if (["ArrowDown", "s", "S"].includes(e.key)) input.current.down = false;
      if (["ArrowLeft", "a", "A"].includes(e.key)) input.current.left = false;
      if (["ArrowRight", "d", "D"].includes(e.key)) input.current.right = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // --- Resize Handling ---
    const handleResize = () => {
      if (pixiAppRef.current) {
        pixiAppRef.current.renderer.resize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    // --- Cleanup ---
    return () => {
      destroyed = true;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (pixiAppRef.current) {
        pixiAppRef.current.destroy(true, { children: true });
        // Remove Pixi canvas from DOM and restore placeholder div
        if (canvas && canvasParent) {
          const placeholder = document.createElement("div");
          placeholder.id = "game-canvas";
          placeholder.className = "absolute inset-0 z-10 pointer-events-none";
          canvasParent.replaceChild(placeholder, canvas);
        }
      }
      map.remove();
    };
  }, []);

  return null; // No React DOM output; uses #map and #game-canvas
}
