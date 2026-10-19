# Bézier Flow

An interactive 3D cubic Bézier curve editor. Chain curve segments, drag control points in 3D, and watch an object travel along the path.

## Features

- **Chained cubic segments.** Each new segment starts where the previous one ends, and moving a shared joint updates both segments live.
- **3D editing.** Click any anchor (square) or handle (circle) and drag it with the translate gizmo. Orbit and zoom the camera freely.
- **Path animation.** A marker loops along the whole path. Toggle **constant speed** to move at equal distances per frame using arc-length parameterisation; turn it off to step evenly in *t* (3 s per segment), which shows how speed varies along a Bézier curve.
- **Export.** Copy each segment as its Bernstein-form equation:
  `B(t) = (1−t)³P₀ + 3(1−t)²t·P₁ + 3(1−t)t²·P₂ + t³P₃`

## Stack

React 18 · TypeScript · Vite · three.js · React Three Fiber · drei · GSAP · zustand

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run typecheck  # TypeScript only
```

## Project structure

```
src/
  App.tsx                       canvas, camera, grid, orbit controls
  components/
    BezierCurveEditor.tsx       segments, selection, transform gizmo, live curve updates
    BezierLineSegment.tsx       one cubic segment (drei CubicBezierLine)
    ControlPoint.tsx            anchors and handles
    useAnimation.ts             GSAP timeline that moves the marker along the path
    UI/UI.tsx                   controls panel and export dialog
  store/index.ts                zustand store: segments and playback state
  utils/interpolation.ts        cubic Bézier evaluation (Bernstein basis)
  utils/helpers.ts              live Line2 geometry updates, random points
```

## v2 changes

- Moved from Create React App to Vite; React 18 `createRoot`; current three / R3F / drei / zustand / TypeScript versions
- Fixed removed APIs (`sphereBufferGeometry`, `boxBufferGeometry`, `@react-three/drei/core`, zustand default import)
- Fixed the animation: the old timeline tweened x/y/z and then overwrote them, and used an invalid ease
- Added arc-length (constant speed) playback, an in-app export dialog instead of `alert()`, and a responsive controls panel
