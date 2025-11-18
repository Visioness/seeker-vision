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
  const dragged = useRef(null);

  const handleDragStart = (e) => {
    if (
      !(
        e.target.classList.contains('start') ||
        e.target.classList.contains('end')
      )
    ) {
      e.preventDefault();
      return;
    }

    const isStart = e.target.classList.contains('start');

    const dragImage = document.createElement('div');
    dragImage.style.cssText = `
      position: absolute;
      top: -9999px;
      width: ${CELL_SIZE}px;
      height: ${CELL_SIZE}px;
      border-radius: 16px;
      background-color: ${isStart ? '#00ff0080' : '#ff000080'};
      border: 4px solid ${isStart ? '#00ff00cc' : '#ff0000cc'};
      box-sizing: border-box;
    `;

    document.body.appendChild(dragImage);

    e.dataTransfer.setDragImage(dragImage, CELL_SIZE / 2, CELL_SIZE / 2);

    setTimeout(() => document.body.removeChild(dragImage), 0);

    dragged.current = {
      state: isStart ? 'start shadow' : 'end shadow',
      previousRow: Number(e.target.dataset.row),
      previousCol: Number(e.target.dataset.col),
    };
  };

  const handleDragOver = (e) => {
    if (!dragged.current || !e.target.classList.contains('board-cell')) {
      return;
    }

    e.preventDefault();
    dragged.current.nextRow = Number(e.target.dataset.row);
    dragged.current.nextCol = Number(e.target.dataset.col);
  };

  const handleDragEnd = (e) => {
    e.preventDefault();

    if (!dragged.current) {
      return;
    }

    if (
      dragged.current.nextRow === undefined ||
      dragged.current.nextCol === undefined
    ) {
      dragged.current = null;
      return;
    }

    const targetCell =
      board.state[dragged.current.nextRow]?.[dragged.current.nextCol];

    if (targetCell === 'shadow' || targetCell.startsWith('wall')) {
      const newBoardState = board.state.map((row) => [...row]);
      newBoardState[dragged.current.previousRow][dragged.current.previousCol] =
        'shadow';
      newBoardState[dragged.current.nextRow][dragged.current.nextCol] =
        dragged.current.state;

      updateNeighborWalls(
        newBoardState,
        dragged.current.nextRow,
        dragged.current.nextCol
      );

      const isStart = dragged.current.state === 'start shadow';
      const newPositions = {
        row: dragged.current.nextRow,
        col: dragged.current.nextCol,
      };

      setBoard((previous) => ({
        ...previous,
        state: newBoardState,
        positions: {
          start: isStart ? newPositions : previous.positions.start,
          end: !isStart ? newPositions : previous.positions.end,
        },
      }));
    }

    dragged.current = null;
  };

  const handleMouseDown = (e) => {
    if (
      !(
        e.target.classList.contains('start') ||
        e.target.classList.contains('end')
      )
    ) {
      e.preventDefault();
      walls.current.drawing = true;
    }
  };

  const handleMouseMove = (e) => {
    if (!walls.current.drawing || !e.target.classList.contains('board-cell')) {
      return;
    }

    const row = Number(e.target.dataset.row);
    const col = Number(e.target.dataset.col);

    if (row === walls.current.last.row && col === walls.current.last.col) {
      return;
    }

    const cell = board.state[row][col];
    walls.current.last.row = row;
    walls.current.last.col = col;

    if (cell === 'shadow' || cell.startsWith('wall')) {
      const newBoardState = board.state.map((row) => [...row]);
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
  };

  const handleMouseUp = () => {
    walls.current.drawing = false;
    walls.current.last = { row: null, col: null };
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
      draggable={false}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ '--cell-size': `${CELL_SIZE}px` }}>
      {board.state &&
        board.state.map((row, rowIndex) => (
          <div key={rowIndex} className='board-row' draggable={false}>
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
