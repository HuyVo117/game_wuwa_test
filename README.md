# Overflow Palette (React Migration)

This is the React + Vite migration of the original vanilla JS color flood puzzle game.

## Scripts

- `npm run dev` start dev server
- `npm run build` production build
- `npm run preview` preview production build

## Structure
```
src/
  App.jsx            Main UI composition
  main.jsx           Entry point
  gameConfig.js      Game constants
  hooks/useOverflowGame.js  Core game logic as a reusable hook
style.css            Reused styling from original project
```

## Next Steps
- Persist progress (localStorage) for completed levels
- Add star rating per level (moves remaining)
- Animations with Framer Motion for transitions
- Sound toggle and real audio assets
- Undo last move leveraging movesHistory (extend hook)
- Multi-game hub registry

Enjoy hacking!
