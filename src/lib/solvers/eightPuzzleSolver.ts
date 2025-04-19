
// Helper to find the position of the empty tile (0)
const findEmptyPosition = (state: number[][]) => {
  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[i].length; j++) {
      if (state[i][j] === 0) {
        return [i, j];
      }
    }
  }
  return null;
};

// Generate possible next states by moving the empty tile
const getNeighbors = (state: number[][]): number[][][] => {
  const moves: number[][][] = [];
  const empty = findEmptyPosition(state);
  
  if (!empty) return moves;
  
  const [row, col] = empty;
  const directions = [
    [0, 1],  // right
    [1, 0],  // down
    [0, -1], // left
    [-1, 0]  // up
  ];
  
  for (const [dx, dy] of directions) {
    const newRow = row + dx;
    const newCol = col + dy;
    
    if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
      // Deep copy the state
      const newState = state.map(r => [...r]);
      
      // Swap the empty tile with the adjacent tile
      newState[row][col] = newState[newRow][newCol];
      newState[newRow][newCol] = 0;
      
      moves.push(newState);
    }
  }
  
  return moves;
};

// Convert state to string for hashing
const stringify = (state: number[][]): string => {
  return state.flat().join('');
};

// Check if two states are equal
const areStatesEqual = (state1: number[][], state2: number[][]): boolean => {
  return stringify(state1) === stringify(state2);
};

// Manhattan distance heuristic
const manhattanDistance = (state: number[][], goal: number[][]): number => {
  let distance = 0;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const value = state[i][j];
      if (value !== 0) {
        // Find value position in goal state
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            if (goal[r][c] === value) {
              distance += Math.abs(r - i) + Math.abs(c - j);
              break;
            }
          }
        }
      }
    }
  }
  
  return distance;
};

// A* Search Algorithm
export const solvePuzzleAStar = async (
  initial: number[][],
  goal: number[][]
): Promise<number[][][]> => {
  // Priority queue (sorted array for simplicity)
  let queue: Array<{
    state: number[][];
    cost: number;
    estimation: number;
    path: number[][][];
  }> = [];
  
  const visited = new Set<string>();
  
  // Add initial state to the queue
  queue.push({
    state: initial,
    cost: 0,
    estimation: manhattanDistance(initial, goal),
    path: [initial]
  });
  
  while (queue.length > 0) {
    // Sort by estimated total cost (f = g + h)
    queue.sort((a, b) => (a.cost + a.estimation) - (b.cost + b.estimation));
    
    // Get the most promising state
    const { state, cost, path } = queue.shift()!;
    const stateKey = stringify(state);
    
    // Skip if already visited
    if (visited.has(stateKey)) continue;
    
    // Mark as visited
    visited.add(stateKey);
    
    // Check if we reached the goal
    if (areStatesEqual(state, goal)) {
      return path;
    }
    
    // Generate next possible states
    const neighbors = getNeighbors(state);
    
    for (const neighbor of neighbors) {
      const neighborKey = stringify(neighbor);
      
      if (!visited.has(neighborKey)) {
        queue.push({
          state: neighbor,
          cost: cost + 1,
          estimation: manhattanDistance(neighbor, goal),
          path: [...path, neighbor]
        });
      }
    }
    
    // Simulate some delay to show the algorithm is working
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return []; // No solution found
};

// BFS Search Algorithm
export const solvePuzzleBFS = async (
  initial: number[][],
  goal: number[][]
): Promise<number[][][]> => {
  const queue: Array<{
    state: number[][];
    path: number[][][];
  }> = [];
  
  const visited = new Set<string>();
  
  // Add initial state to the queue
  queue.push({
    state: initial,
    path: [initial]
  });
  
  while (queue.length > 0) {
    // Get the first state from the queue (FIFO)
    const { state, path } = queue.shift()!;
    const stateKey = stringify(state);
    
    // Skip if already visited
    if (visited.has(stateKey)) continue;
    
    // Mark as visited
    visited.add(stateKey);
    
    // Check if we reached the goal
    if (areStatesEqual(state, goal)) {
      return path;
    }
    
    // Generate next possible states
    const neighbors = getNeighbors(state);
    
    for (const neighbor of neighbors) {
      const neighborKey = stringify(neighbor);
      
      if (!visited.has(neighborKey)) {
        queue.push({
          state: neighbor,
          path: [...path, neighbor]
        });
      }
    }
    
    // Simulate some delay to show the algorithm is working
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return []; // No solution found
};
