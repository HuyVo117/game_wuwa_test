import React from 'react';
import { GAME_CONFIG } from '../../gameConfig';

export const DifficultyButtons = ({current, onChange}) => (
  <div className="difficulty-buttons">
    {Object.entries(GAME_CONFIG.difficulties).map(([k,v]) => (
      <button key={k} className={`btn btn--secondary difficulty-btn ${current===k? 'active':''}`} onClick={()=>onChange(k)}>
        <span className="difficulty-label">{k}</span>
        <span className="difficulty-info">{v.moves} bước • {v.colorCount} màu</span>
      </button>
    ))}
  </div>
);
