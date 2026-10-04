# HarmoniPC — Real Harmonium on Your Laptop

Play harmonium on your laptop using your keyboard for reeds and the touchpad/mouse for bellows.

**Live demo:** https://laptopharmonium.vercel.app

## How it works

- **Reeds:** computer-keyboard keys are mapped to notes (`src/lib/mapping.ts`, `src/components/Keyboard.tsx`).
- **Bellows:** pointer movement pumps the bellows (`src/components/Bellows.tsx`) and drives the pressure
  shown on the gauge, which shapes the sound.
- **Sound:** synthesised in the browser with the Web Audio API (`src/hooks/useAudioEngine.ts`), with
  single, double and triple reed modes; bellows pressure feeds the engine.
- **Settings** (theme, octave, scale) are persisted in `localStorage`.

## Stack

TypeScript, React 18, Vite, Tailwind CSS, Framer Motion, Web Audio API.

## Scripts
- `npm run dev` – start dev server
- `npm run build` – build for production
- `npm run preview` – preview build

## Setup
1. Install Node 18+.
2. `npm install`
3. `npm run dev`

## Notes
The audio engine is synth-only. Loading recorded harmonium samples is not implemented yet.
