import { useLayoutEffect, useRef, useState } from 'react';
import './Board.css';

const CELL_SIZE = 40;

const createInitialBoard = (rows, cols) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 'shadow')
  );
};

function Board() {
  const [boardState, setBoardState] = useState(null);
  const boardRef = useRef(null);
  const dimensionsRef = useRef({ rows: 0, cols: 0 });

  console.log('Board render');
  useLayoutEffect(() => {
    const board = boardRef.current;

    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;

      const rect = entries[0].contentRect;
      const cols = Math.floor(rect.width / CELL_SIZE);
      const rows = Math.floor(rect.height / CELL_SIZE);

      if (rows <= 0 || cols <= 0) return;

      if (
        dimensionsRef.current.rows !== rows ||
        dimensionsRef.current.cols !== cols
      ) {
        dimensionsRef.current = { rows, cols };
        setBoardState(createInitialBoard(rows, cols));
      }
    });

    observer.observe(board);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={boardRef} className='board'>
      {boardState &&
        boardState.map((row, rowIndex) => (
          <div key={rowIndex} className='board-row'>
            {row.map((col, colIndex) => (
              <div key={colIndex} className={`board-cell ${col}`}></div>
            ))}
          </div>
        ))}
    </div>
  );
}

export default Board;
