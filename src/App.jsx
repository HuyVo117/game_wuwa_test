import { Hub } from './components/layout/Hub';
import { Intro } from './components/game/Intro';
import { GameBoard } from './components/game/GameBoard';
import { useOverflowGame } from './hooks/useOverflowGame';
import React, { useState } from 'react';

export default function App() {
  const game = useOverflowGame();
  const [screen, setScreen] = useState('hub'); // hub | intro | game

  const toIntro = () => setScreen('intro');
  const toHub = () => setScreen('hub');
  const startGame = () => { 
    console.log('Starting game with difficulty:', game.difficultyKey);
    game.start(); 
    setScreen('game'); 
  };
  const playLevel = (l) => { 
    console.log('Playing level:', l.id, l.difficulty);
    game.pickLevel(l); 
    setScreen('game'); 
  };
  const freePlay = () => {
    console.log('Free play mode');
    if (game.currentLevel) game.clearLevel();
    game.setDifficulty('easy');
    setScreen('intro');
  };

  return (
    <>
      {screen==='hub' && <Hub onPlayLevel={playLevel} onFreePlay={freePlay} />}
      {screen==='intro' && <Intro difficultyKey={game.difficultyKey} setDifficulty={game.setDifficulty} onStart={startGame} onBackHub={toHub} />}
      {screen==='game' && <GameBoard {...game} backToHub={toHub} />}
    </>
  );
}
