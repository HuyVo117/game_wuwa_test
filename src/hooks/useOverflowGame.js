import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GAME_CONFIG } from '../gameConfig';
import { useSounds } from './useSounds';

const GRID_SIZE = Number(import.meta.env.VITE_GAME_GRID_SIZE) || GAME_CONFIG.gridSize;
const DEFAULT_DIFF = import.meta.env.VITE_GAME_DEFAULT_DIFFICULTY || 'easy';

export function useOverflowGame(initialDifficulty=DEFAULT_DIFF) {
  const [grid, setGrid] = useState([]);
  const [difficultyKey, setDifficultyKey] = useState(initialDifficulty);
  const [movesRemaining, setMovesRemaining] = useState(GAME_CONFIG.difficulties[initialDifficulty].moves);
  const [gameColors, setGameColors] = useState(GAME_CONFIG.colors.slice(0, GAME_CONFIG.difficulties[initialDifficulty].colorCount));
  const [isGameActive, setIsGameActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(null);
  const movesHistory = useRef([]);
  const { playSound } = useSounds();

  const difficulty = GAME_CONFIG.difficulties[difficultyKey];

  const generateGrid = useCallback(() => {
    const cells = [];
  for (let i=0;i< GRID_SIZE * GRID_SIZE;i++) {
      const colorIndex = Math.floor(Math.random() * gameColors.length);
      cells.push(gameColors[colorIndex]);
    }
    setGrid(cells);
  }, [gameColors]);

  // Always update gameColors when difficultyKey changes
  useEffect(() => {
    const dif = GAME_CONFIG.difficulties[difficultyKey];
    setMovesRemaining(dif.moves);
    setGameColors(GAME_CONFIG.colors.slice(0, dif.colorCount));
  }, [difficultyKey]);

  const start = useCallback(() => {
    console.log('Starting game with difficulty:', difficultyKey);
    playSound('click');
    setIsGameActive(true);
  }, [difficultyKey, playSound]);

  useEffect(() => {
    if (isGameActive) {
      generateGrid();
    }
  }, [isGameActive, generateGrid]);

  const getNeighbors = useCallback((index) => {
    const neighbors = [];
  const row = Math.floor(index / GRID_SIZE);
  const col = index % GRID_SIZE;
  if (row>0) neighbors.push(index - GRID_SIZE);
  if (row< GRID_SIZE -1) neighbors.push(index + GRID_SIZE);
    if (col>0) neighbors.push(index-1);
    if (col< GRID_SIZE -1) neighbors.push(index+1);
    return neighbors;
  }, []);

  const animateColorChange = (indices, newColor) => new Promise(res => {
    if (!indices.length) return res();
    indices.forEach((idx,i) => {
      setTimeout(() => {
        setGrid(prev => {
          const copy = [...prev];
            copy[idx] = newColor;
            return copy;
        });
      }, i*45);
    });
    setTimeout(res, indices.length*45 + 650);
  });

  const floodFill = useCallback(async (startIndex, originalColor, newColor) => {
    if (originalColor === newColor) return;
    const stack=[startIndex];
    const visited=new Set();
    const toChange=[];
    while(stack.length){
      const cur=stack.pop();
  if (visited.has(cur) || cur<0 || cur>=grid.length) continue;
      if (grid[cur] !== originalColor) continue;
      visited.add(cur); toChange.push(cur);
      getNeighbors(cur).forEach(n => { if (!visited.has(n) && grid[n]===originalColor) stack.push(n); });
    }
    await animateColorChange(toChange, newColor);
  }, [grid, getNeighbors]);

  const selectColor = useCallback(async (selectedColor) => {
    if (!isGameActive || movesRemaining <=0 || isAnimating) return;
    const startColor = grid[0];
    if (startColor === selectedColor) return;
    
    playSound('select');
    movesHistory.current.push(selectedColor);
    setIsAnimating(true);
    await floodFill(0, startColor, selectedColor);
    setMovesRemaining(m => m-1);
    setIsAnimating(false);
  }, [grid, isGameActive, movesRemaining, isAnimating, floodFill, playSound]);

  const won = useMemo(()=> grid.length>0 && grid.every(c => c === grid[0]), [grid]);
  const lost = useMemo(()=> !won && isGameActive && movesRemaining<=0, [won, isGameActive, movesRemaining]);

  useEffect(() => {
    if (won) {
      playSound('success');
    } else if (lost) {
      playSound('fail');
    }
    
    if (won || lost) setIsGameActive(false);
  }, [won, lost, playSound]);

  const reset = useCallback(() => {
    playSound('click');
    setIsGameActive(true); // triggers grid regen via effect
    const dif = GAME_CONFIG.difficulties[difficultyKey];
    setMovesRemaining(dif.moves);
    setGameColors(GAME_CONFIG.colors.slice(0, dif.colorCount));
    movesHistory.current=[];
  }, [difficultyKey, playSound]);

  const setDifficulty = useCallback((d)=>{
    setDifficultyKey(d);
    // Update game settings immediately when difficulty changes
    const dif = GAME_CONFIG.difficulties[d];
    setMovesRemaining(dif.moves);
    setGameColors(GAME_CONFIG.colors.slice(0, dif.colorCount)); 
  },[]);

  const pickLevel = useCallback((level) => {
    setCurrentLevel(level);
    setDifficultyKey(level.difficulty);
    start();
  }, [start]);

  const clearLevel = useCallback(() => {
    setCurrentLevel(null);
  }, []);

  const nextLevel = useCallback(()=>{
    if (!currentLevel) return;
    const idx = GAME_CONFIG.levelSets.findIndex(l => l.id === currentLevel.id);
    const nxt = GAME_CONFIG.levelSets[idx+1];
    if (nxt) pickLevel(nxt);
  }, [currentLevel, pickLevel]);

  return {
    grid,
    difficultyKey,
    movesRemaining,
    gameColors,
    isGameActive,
    isAnimating,
    currentLevel,
    won, lost,
    start, reset,
    setDifficulty, selectColor,
  pickLevel, nextLevel, clearLevel
  };
}
