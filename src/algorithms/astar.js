import { Node } from '../utils/util.js';
import BaseAlgorithm from './base.js';

class AStar extends BaseAlgorithm {
  constructor(initialState) {
    super(initialState);
  }

  initialize() {
    this.result = {
      visitedStates: [],
      solution: null,
    };

    this.explored = new Set();
    this.startNode = new Node(this.start, null, null);
    this.startNode.g = 0;
    this.startNode.h = this.heuristic(this.start);

    this.frontier = [];
    this.frontier.push(this.startNode);
  }

  run() {
    while (this.frontier.length !== 0) {
      const node = this.getLowestCost(this.frontier);
      this.explored.add(node.state);
      this.result.visitedStates.push(node.state);

      if (node.state === this.end) {
        this.result.solution = this.getSolution(node);

        return this.result;
      }

      this.addNeighborsToFrontier(node);
    }

    throw new Error('No solution!');
  }

  addNeighborsToFrontier(node) {
    const neighbors = this.getNeighbors(node);

    for (const [action, state] of Object.entries(neighbors)) {
      if (
        !(
          state === null ||
          this.inFrontierAlready(state) ||
          this.explored.has(state)
        )
      ) {
        const childNode = new Node(state, node, action);
        childNode.g = node.g + 1;
        childNode.h = this.heuristic(state);

        this.frontier.push(childNode);
      }
    }
  }

  heuristic(state) {
    const [endRow, endCol] = this.getRowsAndCols(this.end);
    const [row, col] = this.getRowsAndCols(state);

    return Math.abs(endRow - row) + Math.abs(endCol - col);
  }

  getLowestCost(frontier) {
    let lowestCost = Infinity;
    let lowestIndex = null;

    frontier.forEach((node, index) => {
      const currentCost = node.g + node.h;
      if (lowestCost > currentCost) {
        lowestCost = currentCost;
        lowestIndex = index;
      }
    });

    return frontier.splice(lowestIndex, 1)[0];
  }

  inFrontierAlready(state) {
    return this.frontier.some((node) => node.state === state);
  }
}

export default AStar;
