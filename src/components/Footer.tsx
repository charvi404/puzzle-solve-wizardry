
import { Puzzle } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white py-6 border-t mt-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Puzzle className="h-5 w-5 text-puzzle-primary" />
          <span className="text-lg font-medium">Puzzle Solve Wizardry</span>
        </div>
        <p className="text-sm text-gray-600">
          An interactive playground for classic puzzle algorithms.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Visualizing 8-Puzzle and Sudoku solving techniques.
        </p>
      </div>
    </footer>
  );
};
