
import { useState, useEffect } from "react";
import { PuzzleBoard } from "./PuzzleBoard";
import { solvePuzzleAStar, solvePuzzleBFS } from "@/lib/solvers/eightPuzzleSolver";
import { Button } from "@/components/ui/button";
import { Tabs } from "../Tabs";
import { ArrowLeft, ArrowRight, Check, RefreshCw, X } from "lucide-react";

// Default states
const DEFAULT_INITIAL_STATE = [
  [1, 2, 3],
  [4, 0, 6],
  [7, 5, 8],
];

const DEFAULT_GOAL_STATE = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0],
];

export const EightPuzzleSolver = () => {
  const [initialState, setInitialState] = useState<number[][]>(DEFAULT_INITIAL_STATE);
  const [goalState, setGoalState] = useState<number[][]>(DEFAULT_GOAL_STATE);
  const [configMode, setConfigMode] = useState<"initial" | "goal">("initial");
  const [algorithm, setAlgorithm] = useState<"astar" | "bfs">("astar");
  const [solving, setSolving] = useState(false);
  const [solution, setSolution] = useState<number[][][]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Reset the puzzle to default states
  const resetPuzzle = () => {
    setInitialState([...DEFAULT_INITIAL_STATE.map(row => [...row])]);
    setGoalState([...DEFAULT_GOAL_STATE.map(row => [...row])]);
    setSolution([]);
    setCurrentStep(0);
    setError(null);
  };

  // Handle tile clicks when editing the board
  const handleTileClick = (row: number, col: number) => {
    const board = configMode === "initial" ? initialState : goalState;
    const empty = findEmptyPosition(board);
    
    if (!empty) return;
    
    // Check if the clicked tile is adjacent to the empty space
    if (isAdjacent(row, col, empty[0], empty[1])) {
      const newBoard = board.map(r => [...r]);
      newBoard[empty[0]][empty[1]] = newBoard[row][col];
      newBoard[row][col] = 0;
      
      if (configMode === "initial") {
        setInitialState(newBoard);
      } else {
        setGoalState(newBoard);
      }
    }
  };

  // Find the position of the empty tile (0)
  const findEmptyPosition = (board: number[][]) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) {
          return [i, j];
        }
      }
    }
    return null;
  };

  // Check if two positions are adjacent
  const isAdjacent = (row1: number, col1: number, row2: number, col2: number) => {
    return (
      (Math.abs(row1 - row2) === 1 && col1 === col2) ||
      (Math.abs(col1 - col2) === 1 && row1 === row2)
    );
  };

  // Solve the puzzle
  const solvePuzzle = async () => {
    setError(null);
    setSolving(true);
    setSolution([]);
    setCurrentStep(0);
    
    try {
      const result = algorithm === "astar" 
        ? await solvePuzzleAStar(initialState, goalState) 
        : await solvePuzzleBFS(initialState, goalState);
      
      if (!result || result.length === 0) {
        setError("No solution found. Try a different configuration.");
      } else {
        setSolution(result);
      }
    } catch (err) {
      setError("An error occurred while solving the puzzle.");
      console.error(err);
    } finally {
      setSolving(false);
    }
  };

  // Navigate through solution steps
  const goToStep = (step: number) => {
    if (solution.length > 0 && step >= 0 && step < solution.length) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="puzzle-board-container">
      <Tabs
        tabs={[
          { id: "initial", label: "Initial State" },
          { id: "goal", label: "Goal State" },
          { id: "solution", label: "Solution", },
        ]}
        activeTab={solution.length > 0 ? "solution" : configMode}
        onTabChange={(tab) => {
          if (tab === "solution" && solution.length === 0) {
            solvePuzzle();
          } else if (tab === "initial" || tab === "goal") {
            setConfigMode(tab as "initial" | "goal");
          }
        }}
      />

      <div className="flex flex-col items-center">
        {configMode === "initial" && !solution.length && (
          <div className="text-center">
            <h3 className="text-lg font-medium mb-4">Configure Initial State</h3>
            <PuzzleBoard
              board={initialState}
              editable={true}
              onTileClick={handleTileClick}
              highlightEmpty={true}
            />
            <p className="text-sm text-gray-500 mt-2">
              Click on tiles adjacent to the empty space to move them
            </p>
          </div>
        )}

        {configMode === "goal" && !solution.length && (
          <div className="text-center">
            <h3 className="text-lg font-medium mb-4">Configure Goal State</h3>
            <PuzzleBoard
              board={goalState}
              editable={true}
              onTileClick={handleTileClick}
              highlightEmpty={true}
            />
            <p className="text-sm text-gray-500 mt-2">
              Click on tiles adjacent to the empty space to move them
            </p>
          </div>
        )}

        {solution.length > 0 && (
          <div className="text-center">
            <h3 className="text-lg font-medium mb-4">
              Solution: Step {currentStep + 1} of {solution.length}
            </h3>
            <PuzzleBoard
              board={solution[currentStep]}
              className="puzzle-solution-step"
            />
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToStep(currentStep - 1)}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToStep(currentStep + 1)}
                disabled={currentStep === solution.length - 1}
              >
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Solved in {solution.length - 1} moves using {algorithm === "astar" ? "A* Search" : "BFS"}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
            <X className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <div>
            <h4 className="text-sm font-medium mb-2">Algorithm</h4>
            <div className="flex gap-2">
              <Button
                variant={algorithm === "astar" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlgorithm("astar")}
                className={algorithm === "astar" ? "bg-puzzle-primary" : ""}
              >
                A* Search
              </Button>
              <Button
                variant={algorithm === "bfs" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlgorithm("bfs")}
                className={algorithm === "bfs" ? "bg-puzzle-primary" : ""}
              >
                BFS
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            onClick={solvePuzzle}
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
            onClick={resetPuzzle}
            className="puzzle-button-outlined"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Reset
          </Button>
        </div>
      </div>
    </div>
  );
};
