import './Cell.css';
import { memo } from 'react';

const Cell = memo(function Cell({ state }) {
  console.log('Cell render');
  return <div className={`board-cell ${state}`}></div>;
});

export default Cell;
