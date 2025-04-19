
import { Puzzle } from "lucide-react";

export const PuzzleHeader = () => {
  return (
    <div className="text-center py-6">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Puzzle className="h-8 w-8 text-puzzle-primary" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-puzzle-primary via-puzzle-secondary to-puzzle-accent text-transparent bg-clip-text">
          Puzzle Solve Wizardry
        </h1>
      </div>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Interactive playground for solving classic puzzles with various algorithms.
        Select a puzzle type below and watch how different solving techniques work.
      </p>
    </div>
  );
};
