
import { useState, useEffect } from "react";
import { SudokuBoard } from "./SudokuBoard";
import { 
  getDefaultSudoku, 
  cloneBoard, 
  solveSudokuWithSteps, 
  logicalSudokuSolver,
  hybridSudokuSolver
} from "@/lib/solvers/sudokuSolver";
import { Button } from "@/components/ui/button";
import { Tabs } from "../Tabs";
import { Check, RefreshCw, X } from "lucide-react";

export const SudokuSolver = () => {
  const [board, setBoard] = useState<number[][]>(getDefaultSudoku());
  const [originalBoard, setOriginalBoard] = useState<number[][]>(cloneBoard(getDefaultSudoku()));
  const [solving, setSolving] = useState(false);
  const [algorithm, setAlgorithm] = useState<"backtracking" | "logical" | "hybrid">("hybrid");
  const [highlightCell, setHighlightCell] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  
  // Reset the board to the original state or a new puzzle
  const resetBoard = (newPuzzle = false) => {
    if (newPuzzle) {
      const defaultBoard = getDefaultSudoku();
      setBoard(cloneBoard(defaultBoard));
      setOriginalBoard(cloneBoard(defaultBoard));
    } else {
      setBoard(cloneBoard(originalBoard));
    }
    setHighlightCell(null);
    setError(null);
    setSolved(false);
  };
  
  // Handle changing a cell value when editing
  const handleCellValueChange = (row: number, col: number, value: number) => {
    const newBoard = cloneBoard(board);
    newBoard[row][col] = value;
    setBoard(newBoard);
    
    if (!solved) {
      setOriginalBoard(cloneBoard(newBoard));
    }
  };
  
  // Clear the entire board
  const clearBoard = () => {
    const emptyBoard = Array(9).fill(0).map(() => Array(9).fill(0));
    setBoard(emptyBoard);
    setOriginalBoard(cloneBoard(emptyBoard));
    setHighlightCell(null);
    setError(null);
    setSolved(false);
  };
  
  // Handle step updates during solving
  const handleSolveStep = (row: number, col: number, value: number) => {
    setHighlightCell([row, col]);
    setBoard(prevBoard => {
      const newBoard = cloneBoard(prevBoard);
      newBoard[row][col] = value;
      return newBoard;
    });
  };
  
  // Solve the sudoku using the selected algorithm
  const solveSudoku = async () => {
    setError(null);
    setSolving(true);
    setSolved(false);
    
    try {
      // First, make a copy of the original board to solve
      const boardToSolve = cloneBoard(originalBoard);
      let success = false;
      
      // Choose the appropriate algorithm
      if (algorithm === "backtracking") {
        success = await solveSudokuWithSteps(boardToSolve, handleSolveStep, 10);
      } else if (algorithm === "logical") {
        success = await logicalSudokuSolver(boardToSolve, handleSolveStep, 50);
      } else {
        success = await hybridSudokuSolver(boardToSolve, handleSolveStep, 20);
      }
      
      if (success) {
        setBoard(boardToSolve);
        setSolved(true);
      } else {
        setError("Could not solve the puzzle with the current algorithm. Try a different method.");
      }
    } catch (err) {
      setError("An error occurred while solving.");
      console.error(err);
    } finally {
      setSolving(false);
      setHighlightCell(null);
    }
  };
  
  return (
    <div className="puzzle-board-container">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 text-center">Sudoku Solver</h3>
        
        <SudokuBoard
          board={board}
          editable={!solving && !solved}
          onCellValueChange={handleCellValueChange}
          highlightCell={highlightCell}
        />
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
            <X className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        
        {solved && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
            <Check className="w-5 h-5 mr-2" />
            Puzzle solved successfully!
          </div>
        )}
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Algorithm</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={algorithm === "backtracking" ? "default" : "outline"}
              size="sm"
              onClick={() => setAlgorithm("backtracking")}
              className={algorithm === "backtracking" ? "bg-puzzle-primary" : ""}
            >
              Backtracking
            </Button>
            <Button
              variant={algorithm === "logical" ? "default" : "outline"}
              size="sm"
              onClick={() => setAlgorithm("logical")}
              className={algorithm === "logical" ? "bg-puzzle-primary" : ""}
            >
              Logical Solver
            </Button>
            <Button
              variant={algorithm === "hybrid" ? "default" : "outline"}
              size="sm"
              onClick={() => setAlgorithm("hybrid")}
              className={algorithm === "hybrid" ? "bg-puzzle-primary" : ""}
            >
              Hybrid
            </Button>
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Button
            onClick={solveSudoku}
            disabled={solving}
            className="puzzle-button-primary"
          >
            {solving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Solving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" /> Solve Puzzle
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => resetBoard(false)}
            className="puzzle-button-outlined"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Reset
          </Button>
          <Button
            variant="outline"
            onClick={() => resetBoard(true)}
          >
            Load Example
          </Button>
          <Button
            variant="outline"
            onClick={clearBoard}
          >
            Clear Board
          </Button>
        </div>
      </div>
    </div>
  );
};
