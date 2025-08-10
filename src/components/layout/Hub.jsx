import React, { useEffect, useRef } from 'react';
import { GAME_CONFIG } from '../../gameConfig';

export function Hub({onPlayLevel, onFreePlay, unlockedLevels=3, completedLevels=0}) {
  const pathRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => { if (gridRef.current && pathRef.current) buildPath(); }, []);

  const buildPath = () => {
    const grid = gridRef.current;
    if (!grid) return;
    const buttons = grid.querySelectorAll('.level-btn');
    if (buttons.length < 2) return;
    const points = Array.from(buttons).map(btn => {
      const rect = btn.getBoundingClientRect();
      const gridRect = grid.getBoundingClientRect();
      return { x: rect.left + rect.width/2 - gridRect.left, y: rect.top + rect.height/2 - gridRect.top };
    });
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i=0;i<points.length-1;i++) {
      const p1=points[i], p2=points[i+1];
      const xm=(p1.x+p2.x)/2;
      d += ` C ${xm} ${p1.y}, ${xm} ${p2.y}, ${p2.x} ${p2.y}`;
    }
    pathRef.current.setAttribute('d', d);
  };

  return (
    <div className="hub-screen active">
      <div className="hub-header">
        <h1 className="hub-title">Color Worlds</h1>
        <p className="hub-subtitle">Hành trình đầy màu sắc</p>
      </div>
      <div className="levels-container">
        <div className="levels-grid" ref={gridRef}>
          <svg className="level-path" width="100%" height="100%" preserveAspectRatio="none"><path ref={pathRef} d="" /></svg>
          {GAME_CONFIG.levelSets.map((l, i) => {
            const locked = i >= unlockedLevels;
            const completed = i < completedLevels;
            return (
              <button
                key={l.id}
                className={`level-btn ${locked? 'locked':''} ${completed? 'completed':''}`}
                disabled={locked}
                onClick={!locked? ()=>onPlayLevel(l): undefined}
                title={`${l.name} (${l.difficulty})`}
              >{l.id}</button>
            );
          })}
        </div>
      </div>
      <div className="hub-footer">
        <button className="btn btn--secondary btn--sm" onClick={onFreePlay}>Chơi tự do</button>
      </div>
    </div>
  );
}
