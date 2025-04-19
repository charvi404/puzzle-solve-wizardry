// Check if a number can be placed in a specific cell
export const isValid = (board: number[][], row: number, col: number, num: number): boolean => {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) {
      return false;
    }
  }
  
  // Check column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) {
      return false;
    }
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) {
        return false;
      }
    }
  }
  
  return true;
};

// Find an empty cell in the board
export const findEmpty = (board: number[][]): [number, number] | null => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        return [i, j];
      }
    }
  }
  return null;
};

// Backtracking solver with steps for visualization
export const solveSudokuWithSteps = async (
  board: number[][],
  onStepCallback?: (row: number, col: number, value: number) => void,
  delay: number = 0
): Promise<boolean> => {
  // Find empty cell
  const empty = findEmpty(board);
  
  // No empty cells, puzzle is solved
  if (!empty) {
    return true;
  }
  
  const [row, col] = empty;
  
  // Try each digit 1-9
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      // Place the number
      board[row][col] = num;
      
      if (onStepCallback) {
        onStepCallback(row, col, num);
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      // Recursively solve the rest of the puzzle
      if (await solveSudokuWithSteps(board, onStepCallback, delay)) {
        return true;
      }
      
      // If placing this number didn't lead to a solution, backtrack
      board[row][col] = 0;
      
      if (onStepCallback) {
        onStepCallback(row, col, 0);
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
  }
  
  // No solution found with current configuration
  return false;
};

// Get possible values for a cell (used in logical solver)
export const getPossibleValues = (board: number[][], row: number, col: number): number[] => {
  if (board[row][col] !== 0) {
    return [];
  }
  
  const possible = new Set(Array.from({ length: 9 }, (_, i) => i + 1));
  
  // Check row
  for (let i = 0; i < 9; i++) {
    possible.delete(board[row][i]);
  }
  
  // Check column
  for (let i = 0; i < 9; i++) {
    possible.delete(board[i][col]);
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      possible.delete(board[boxRow + i][boxCol + j]);
    }
  }
  
  return Array.from(possible);
};

// Logic-based solver (Naked Singles + Hidden Singles)
export const logicalSudokuSolver = async (
  board: number[][],
  onStepCallback?: (row: number, col: number, value: number) => void,
  delay: number = 0
): Promise<boolean> => {
  let changed = true;
  let boardCompleted = false;
  
  // Keep solving as long as we're making progress
  while (changed && !boardCompleted) {
    changed = false;
    boardCompleted = true;
    
    // Naked Singles strategy
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          boardCompleted = false;
          const possible = getPossibleValues(board, row, col);
          
          if (possible.length === 1) {
            board[row][col] = possible[0];
            changed = true;
            
            if (onStepCallback) {
              onStepCallback(row, col, possible[0]);
              if (delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
              }
            }
          }
        }
      }
    }
    
    // Hidden Singles strategy
    for (const unitType of ['row', 'column', 'box']) {
      for (let unit = 0; unit < 9; unit++) {
        // For each digit 1-9
        for (let digit = 1; digit <= 9; digit++) {
          const positions: [number, number][] = [];
          
          // Check where this digit can go in the current unit
          for (let i = 0; i < 9; i++) {
            let row, col;
            
            if (unitType === 'row') {
              row = unit;
              col = i;
            } else if (unitType === 'column') {
              row = i;
              col = unit;
            } else { // box
              row = Math.floor(unit / 3) * 3 + Math.floor(i / 3);
              col = (unit % 3) * 3 + (i % 3);
            }
            
            if (board[row][col] === 0 && isValid(board, row, col, digit)) {
              positions.push([row, col]);
            }
          }
          
          // If there's only one possible position for this digit in this unit
          if (positions.length === 1) {
            const [row, col] = positions[0];
            board[row][col] = digit;
            changed = true;
            
            if (onStepCallback) {
              onStepCallback(row, col, digit);
              if (delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
              }
            }
          }
        }
      }
    }
  }
  
  return !findEmpty(board);
};

// Hybrid solver: first apply logical techniques, then backtracking if needed
export const hybridSudokuSolver = async (
  board: number[][],
  onStepCallback?: (row: number, col: number, value: number) => void,
  delay: number = 0
): Promise<boolean> => {
  // First use logical solver
  await logicalSudokuSolver(board, onStepCallback, delay);
  
  // If not solved, use backtracking
  if (findEmpty(board)) {
    return solveSudokuWithSteps(board, onStepCallback, delay);
  }
  
  return true;
};

// Default hardcoded puzzle
export const getDefaultSudoku = (): number[][] => {
  return [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];
};

// Create a deep copy of a board
export const cloneBoard = (board: number[][]): number[][] => {
  return board.map(row => [...row]);
};
