import './Cell.css';
import { memo, useMemo } from 'react';

const Cell = memo(function Cell({ state, row, col }) {
  const classList = useMemo(() => {
    return state.startsWith('wall') ? state.replace('-', ' ') : state;
  }, [state]);

  return (
    <div
      className={`board-cell ${classList}`}
      data-row={row}
      data-col={col}></div>
  );
});

export default Cell;
