class BaseAlgorithm {
  constructor(initialState, start, end) {
    this.boardState = initialState;
    this.start = start;
    this.end = end;
  }

  initialize() {}

  getSolution(node) {
    const states = [];

    while (node.parent !== null) {
      states.push(node.state);

      node = node.parent;
    }

    states.push(node.state);

    return states.reverse();
  }

  getRowsAndCols(state) {
    return state.split('-').map((value) => Number(value));
  }

  getNeighbors(node) {
    const neighbors = {
      top: null,
      right: null,
      bottom: null,
      left: null,
    };

    const [row, col] = this.getRowsAndCols(node.state);

    if (row > 0 && this.boardState[row - 1][col] !== 'wall') {
      neighbors.top = `${row - 1}-${col}`;
    }

    if (
      row < this.boardState.length - 1 &&
      this.boardState[row + 1][col] !== 'wall'
    ) {
      neighbors.bottom = `${row + 1}-${col}`;
    }

    if (col > 0 && this.boardState[row][col - 1] !== 'wall') {
      neighbors.left = `${row}-${col - 1}`;
    }

    if (
      col < this.boardState[row].length - 1 &&
      this.boardState[row][col + 1] !== 'wall'
    ) {
      neighbors.right = `${row}-${col + 1}`;
    }

    return neighbors;
  }
}

export default BaseAlgorithm;
