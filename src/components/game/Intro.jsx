import React from 'react';
import { GAME_CONFIG } from '../../gameConfig';
import { DifficultyButtons } from './DifficultyButtons';

export function Intro({difficultyKey, setDifficulty, onStart, onBackHub}) {
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
