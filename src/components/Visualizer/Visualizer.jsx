import './Visualizer.css';
import { useLayoutEffect, useRef } from 'react';
import Cell from './Cell/Cell';

const CELL_SIZE = 36;

const getWallType = (boardState, row, col) => {
  const hasWallAbove = row > 0 && boardState[row - 1][col].startsWith('wall');
  const hasWallBelow =
    row < boardState.length - 1 && boardState[row + 1][col].startsWith('wall');

  if (hasWallAbove && hasWallBelow) return 'wall-mid';
  if (hasWallAbove && !hasWallBelow) return 'wall-bottom';
  if (!hasWallAbove && hasWallBelow) return 'wall-top';
  return 'wall';
};

const updateNeighborWalls = (boardState, row, col) => {
  if (row > 0 && boardState[row - 1][col].startsWith('wall')) {
    boardState[row - 1][col] = getWallType(boardState, row - 1, col);
  }

  if (
    row < boardState.length - 1 &&
    boardState[row + 1][col].startsWith('wall')
  ) {
    boardState[row + 1][col] = getWallType(boardState, row + 1, col);
  }
};

function Visualizer({ board, setBoard }) {
  const boardRef = useRef(null);
  const walls = useRef({
    drawing: false,
    last: { row: null, col: null },
  });

  const handleMouseDown = () => {
    walls.current.drawing = true;
  };

  const handleMouseUp = () => {
    walls.current.drawing = false;
  };

  const handleMouseMove = (e) => {
    if (walls.current.drawing) {
      const row = Number(e.target.dataset.row);
      const col = Number(e.target.dataset.col);
      if (
        e.target.classList.contains('board-cell') &&
        (row !== walls.current.last.row || col !== walls.current.last.col)
      ) {
        const cell = board.state[row][col];

        walls.current.last.row = row;
        walls.current.last.col = col;

        if (cell === 'shadow' || cell.startsWith('wall')) {
          const newBoardState = [...board.state];
          if (cell.startsWith('wall')) {
            newBoardState[row][col] = 'shadow';
            updateNeighborWalls(newBoardState, row, col);
          } else {
            newBoardState[row][col] = getWallType(newBoardState, row, col);
            updateNeighborWalls(newBoardState, row, col);
          }

          setBoard((previous) => ({
            ...previous,
            state: newBoardState,
          }));
        }
      }
    }
  };

  useLayoutEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;

      const rect = entries[0].contentRect;
      const cols = Math.floor((rect.width - 2) / (CELL_SIZE - 2));
      const rows = Math.floor((rect.height - 2) / (CELL_SIZE - 2));

      if (rows <= 0 || cols <= 0) return;

      if (board.dimensions.rows !== rows || board.dimensions.cols !== cols) {
        setBoard((previous) => ({
          ...previous,
          dimensions: { rows, cols },
          positions: {
            start: previous.positions.start,
            end: { row: rows - 2, col: cols - 2 },
          },
        }));
      }
    });

    observer.observe(boardRef.current);

    return () => observer.disconnect();
  }, [setBoard]);

  return (
    <div
      ref={boardRef}
      className='board'
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ '--cell-size': `${CELL_SIZE}px` }}>
      {board.state &&
        board.state.map((row, rowIndex) => (
          <div key={rowIndex} className='board-row'>
            {row.map((cell, cellIndex) => (
              <Cell
                key={cellIndex}
                state={cell}
                row={rowIndex}
                col={cellIndex}
              />
            ))}
          </div>
        ))}
    </div>
  );
}

export default Visualizer;
