import './Visualizer.css';
import { useLayoutEffect, useRef } from 'react';
import Cell from './Cell/Cell';

const CELL_SIZE = 40;

const createInitialBoard = (rows, cols) => {
  const initialBoard = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 'shadow')
  );

  initialBoard[1][1] = 'start';
  initialBoard[rows - 2][cols - 2] = 'end';

  return initialBoard;
};

function Visualizer({ board, setBoard }) {
  const boardRef = useRef(null);

  console.log('Board render');
  useLayoutEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;

      const rect = entries[0].contentRect;
      const cols = Math.floor(rect.width / CELL_SIZE);
      const rows = Math.floor(rect.height / CELL_SIZE);

      if (rows <= 0 || cols <= 0) return;

      if (board.dimensions.rows !== rows || board.dimensions.cols !== cols) {
        setBoard({
          state: createInitialBoard(rows, cols),
          dimensions: { rows, cols },
        });
      }
    });

    observer.observe(boardRef.current);

    return () => observer.disconnect();
  }, [board.dimensions, setBoard]);

  return (
    <div ref={boardRef} className='board'>
      {board.state &&
        board.state.map((row, rowIndex) => (
          <div key={rowIndex} className='board-row'>
            {row.map((cell, cellIndex) => (
              <Cell key={cellIndex} state={cell} />
            ))}
          </div>
        ))}
    </div>
  );
}

export default Visualizer;
