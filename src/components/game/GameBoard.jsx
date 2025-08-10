import React from 'react';
import { GAME_CONFIG } from '../../gameConfig';

export function GameBoard({grid, selectColor, gameColors, movesRemaining, reset, backToHub, won, lost, nextLevel, currentLevel}) {
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
