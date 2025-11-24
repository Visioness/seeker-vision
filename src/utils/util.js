class Node {
  constructor(state, parent, action = null) {
    this.state = state;
    this.parent = parent;
    this.action = action;
  }
}

class LinkedListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  append(value) {
    const newNode = new LinkedListNode(value);

    if (this.head === null) {
      this.head = newNode;
      this.tail = this.head;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.size++;
  }

  popFromTail() {
    if (this.isEmpty()) throw new Error('Linked List is empty.');

    const poppedValue = this.tail.value;

    if (this.size > 1) {
      let current = this.head;

      while (current.next !== this.tail) current = current.next;

      this.tail = current;
      this.tail.next = null;
    } else {
      this.tail = null;
      this.head = null;
    }

    this.size--;
    return poppedValue;
  }

  popFromHead() {
    if (this.isEmpty()) throw new Error('Linked List is empty.');

    const poppedValue = this.head.value;

    if (this.size > 1) {
      this.head = this.head.next;
    } else {
      this.head = null;
      this.tail = null;
    }

    this.size--;
    return poppedValue;
  }

  isEmpty() {
    return this.size === 0;
  }
}

class Stack {
  constructor() {
    this.list = [];
  }

  push(node) {
    this.list.push(node);
  }

  pop() {
    if (this.isEmpty()) throw new Error('Stack is empty.');

    return this.list.pop();
  }

  peek() {
    if (this.isEmpty()) throw new Error('Stack is empty.');

    return this.list[this.list.length - 1];
  }

  containsState(state) {
    return this.list.some((node) => node.state === state);
  }

  size() {
    return this.list.length;
  }

  isEmpty() {
    return this.size() === 0;
  }
}

class Queue {
  constructor() {
    this.list = [];
  }

  enqueue(node) {
    this.list.push(node);
  }

  dequeue() {
    if (this.isEmpty()) throw new Error('Queue is empty.');

    return this.list.shift();
  }

  containsState(state) {
    return this.list.some((node) => node.state === state);
  }

  size() {
    return this.list.length;
  }

  isEmpty() {
    return this.size() === 0;
  }
}

class OptimizedQueue {
  constructor() {
    this.list = new LinkedList();
  }

  enqueue(node) {
    this.list.append(node);
  }

  dequeue() {
    if (this.isEmpty()) throw new Error('OptimizedQueue is empty.');

    return this.list.popFromHead();
  }

  containsState(state) {
    if (this.isEmpty()) return false;

    let current = this.list.head;

    while (current !== null) {
      if (current.value.state === state) {
        return true;
      }

      current = current.next;
    }

    return false;
  }

  size() {
    return this.list.size;
  }

  isEmpty() {
    return this.list.isEmpty();
  }
}

export { Node, LinkedListNode, Stack, Queue, OptimizedQueue };
