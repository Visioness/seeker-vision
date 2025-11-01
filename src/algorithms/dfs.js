import { Node, Stack } from '../utils/util.js';
import BaseAlgorithm from './base.js';

class DFS extends BaseAlgorithm {
  constructor(initialState) {
    super(initialState);
  }

  initialize() {
    this.result = {
      visitedStates: [],
      solution: null,
    };

    this.startNode = new Node(this.start, null, null);
    this.explored = new Set();

    this.frontier = new Stack();
    this.frontier.push(this.startNode);
  }

  run() {
    while (!this.frontier.isEmpty()) {
      const node = this.frontier.pop();
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
          this.frontier.containsState(state) ||
          this.explored.has(state)
        )
      ) {
        const childNode = new Node(state, node, action);
        this.frontier.push(childNode);
      }
    }
  }
}

export default DFS;
