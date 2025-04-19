
import { useState } from "react";
import { PuzzleHeader } from "@/components/PuzzleHeader";
import { Tabs } from "@/components/Tabs";
import { EightPuzzleSolver } from "@/components/EightPuzzle/EightPuzzleSolver";
import { SudokuSolver } from "@/components/Sudoku/SudokuSolver";

import { Footer } from "@/components/Footer";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"8puzzle" | "sudoku">("8puzzle");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PuzzleHeader />
      
      <div className="container mx-auto px-4">
        <Tabs
          tabs={[
            { id: "8puzzle", label: "8-Puzzle Solver" },
            { id: "sudoku", label: "Sudoku Solver" },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as "8puzzle" | "sudoku")}
        />
        
        <div className="flex justify-center">
          {activeTab === "8puzzle" ? (
            <EightPuzzleSolver />
          ) : (
            <SudokuSolver />
          )}
        </div>
        
        <div className="mt-12 max-w-3xl mx-auto text-sm text-gray-600 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">About These Puzzles</h3>
          
          {activeTab === "8puzzle" && (
            <>
              <h4 className="font-medium mb-1">8-Puzzle</h4>
              <p className="mb-3">
                The 8-puzzle is a sliding puzzle that consists of a 3×3 grid with 8 square tiles numbered 1 through 8, plus one empty space.
                The goal is to rearrange the tiles to reach the target configuration by sliding tiles into the empty space.
              </p>
              <h4 className="font-medium mb-1">Solving Algorithms</h4>
              <ul className="list-disc pl-5 mb-3 space-y-1">
                <li><strong>A* Search</strong>: Uses Manhattan distance heuristic to find the optimal solution path.</li>
                <li><strong>Breadth-First Search (BFS)</strong>: Explores all neighbor states in order of their distance from the initial state.</li>
              </ul>
            </>
          )}
          
          {activeTab === "sudoku" && (
            <>
              <h4 className="font-medium mb-1">Sudoku</h4>
              <p className="mb-3">
                Sudoku is a logic puzzle where you fill a 9×9 grid with digits 1-9, ensuring each row, column, and 3×3 box contains every digit exactly once.
              </p>
              <h4 className="font-medium mb-1">Solving Algorithms</h4>
              <ul className="list-disc pl-5 mb-3 space-y-1">
                <li><strong>Backtracking</strong>: A brute-force recursive approach that tries options and backtracks when they lead to contradictions.</li>
                <li><strong>Logical Solver</strong>: Uses human-like techniques like Naked Singles and Hidden Singles to solve puzzles.</li>
                <li><strong>Hybrid</strong>: Combines logical techniques first, then uses backtracking for more difficult puzzles.</li>
              </ul>
            </>
          )}
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
