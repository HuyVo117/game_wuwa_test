import React, { useState } from 'react';
import { GAME_CONFIG } from './gameConfig';
import { useOverflowGame } from './hooks/useOverflowGame';

const DifficultyButtons = ({current, onChange}) => (
  <div className="difficulty-buttons">
    {Object.entries(GAME_CONFIG.difficulties).map(([k,v]) => (
      <button key={k} className={`btn btn--secondary difficulty-btn ${current===k? 'active':''}`} onClick={()=>onChange(k)}>
        <span className="difficulty-label">{k}</span>
        <span className="difficulty-info">{v.moves} bước • {v.colorCount} màu</span>
      </button>
    ))}
  </div>
);

function Hub({onPlayLevel, onFreePlay}) {
  return (
    <div className="hub-screen active">
      <div className="hub-header">
        <h1 className="hub-title">Color Worlds</h1>
        <p className="hub-subtitle">Chọn màn để chơi</p>
      </div>
      <div className="levels-container">
        <div className="levels-grid">
          {GAME_CONFIG.levelSets.map(l => (
            <button key={l.id} className="level-btn" onClick={()=>onPlayLevel(l)} title={`${l.name} (${l.difficulty})`}>{l.id}</button>
          ))}
        </div>
      </div>
      <div className="hub-footer">
        <button className="btn btn--secondary btn--sm" onClick={onFreePlay}>Chơi tự do</button>
      </div>
    </div>
  );
}

function Intro({difficultyKey, setDifficulty, onStart, onBackHub}) {
  return (
    <div className="screen active">
      <div className="intro-container">
        <div className="intro-content">
          <h1 className="game-title">Overflow Palette</h1>
          <h2 className="game-subtitle">Chế độ: {difficultyKey}</h2>
          <DifficultyButtons current={difficultyKey} onChange={setDifficulty} />
          <div className="preview-grid">
            {GAME_CONFIG.colors.map(c => <div key={c} className="preview-cell" style={{backgroundColor:c}} />)}
          </div>
          <button className="btn btn--primary go-button" onClick={onStart}>Bắt đầu</button>
          <button className="btn btn--outline btn--sm" onClick={onBackHub}>← Hub</button>
        </div>
      </div>
    </div>
  );
}

function GameBoard({grid, selectColor, gameColors, movesRemaining, reset, backToHub, won, lost, nextLevel, currentLevel}) {
  return (
    <div className="screen active">
      <div className="game-container">
        <header className="game-header">
          <div className="game-info">
            <div className="moves-counter">
              <span className="label">Số bước còn lại:</span>
              <span className="value" id="movesRemaining">{movesRemaining}</span>
            </div>
            <button className="btn btn--outline btn--sm" onClick={reset}>Reset</button>
            <button className="btn btn--secondary btn--sm" onClick={backToHub}>← Hub</button>
          </div>
        </header>
        <main className="game-content">
          <div className="grid-container">
            <div className="game-grid" style={{gridTemplateColumns:`repeat(${GAME_CONFIG.gridSize},1fr)`}}>
              {grid.map((c,i)=>(
                <div key={i} className="grid-cell" style={{backgroundColor:c}} />
              ))}
            </div>
          </div>
          <div className="color-palette">
            <h3>Chọn màu:</h3>
            <div className="color-buttons">
              {gameColors.map(c => <button key={c} className="color-btn" style={{backgroundColor:c}} onClick={()=>selectColor(c)} />)}
            </div>
          </div>
        </main>
        {(won || lost) && (
          <div className="modal-overlay">
            <div className="modal-content-inline">
              {won ? <h2>🎉 Thắng rồi!</h2> : <h2>😔 Thua!</h2>}
              <p>{won? 'Bạn đã chiếm toàn bộ bảng.' : 'Hết lượt rồi. Thử lại nhé.'}</p>
              <div className="modal-buttons">
                {won && currentLevel && <button className="btn btn--primary" onClick={nextLevel}>Màn tiếp theo ➜</button>}
                <button className="btn btn--secondary" onClick={reset}>Chơi lại</button>
                <button className="btn btn--outline" onClick={backToHub}>Trở về menu</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const game = useOverflowGame();
  const [screen, setScreen] = useState('hub'); // hub | intro | game

  const toIntro = () => setScreen('intro');
  const toHub = () => setScreen('hub');
  const startGame = () => { game.start(); setScreen('game'); };
  const playLevel = (l) => { game.pickLevel(l); setScreen('game'); };
  const freePlay = () => { game.setDifficulty('easy'); setScreen('intro'); };

  return (
    <>
      {screen==='hub' && <Hub onPlayLevel={playLevel} onFreePlay={freePlay} />}
      {screen==='intro' && <Intro difficultyKey={game.difficultyKey} setDifficulty={game.setDifficulty} onStart={startGame} onBackHub={toHub} />}
      {screen==='game' && <GameBoard {...game} backToHub={toHub} />}
    </>
  );
}
