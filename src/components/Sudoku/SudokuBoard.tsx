
import { useState } from "react";
import { cn } from "@/lib/utils";

type SudokuBoardProps = {
  board: number[][];
  editable?: boolean;
  onCellValueChange?: (row: number, col: number, value: number) => void;
  highlightCell?: [number, number] | null;
  className?: string;
};

export const SudokuBoard = ({
  board,
  editable = false,
  onCellValueChange,
  highlightCell,
  className,
}: SudokuBoardProps) => {
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  const handleCellClick = (row: number, col: number) => {
    if (editable) {
      setSelectedCell([row, col]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedCell && editable && onCellValueChange) {
      const [row, col] = selectedCell;
      const key = e.key;
      
      if (key === "Backspace" || key === "Delete" || key === "0") {
        onCellValueChange(row, col, 0);
      } else if (/^[1-9]$/.test(key)) {
        onCellValueChange(row, col, parseInt(key));
      } else if (key === "ArrowUp" && row > 0) {
        setSelectedCell([row - 1, col]);
      } else if (key === "ArrowDown" && row < 8) {
        setSelectedCell([row + 1, col]);
      } else if (key === "ArrowLeft" && col > 0) {
        setSelectedCell([row, col - 1]);
      } else if (key === "ArrowRight" && col < 8) {
        setSelectedCell([row, col + 1]);
      }
    }
  };

  const isCellHighlighted = (row: number, col: number) => {
    if (!highlightCell) return false;
    const [hRow, hCol] = highlightCell;
    return row === hRow && col === hCol;
  };

  return (
    <div 
      className={cn("w-96 h-96 grid grid-cols-9 gap-px bg-gray-300", className)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSelected = selectedCell && 
            selectedCell[0] === rowIndex && 
            selectedCell[1] === colIndex;
          
          const isFixed = !editable || (board[rowIndex][colIndex] !== 0 && !isSelected);
          const isEmpty = cell === 0;
          
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "puzzle-tile puzzle-tile-sudoku flex items-center justify-center text-lg",
                isFixed ? "puzzle-tile-sudoku-fixed" : "cursor-pointer",
                isSelected && "border-2 border-puzzle-primary bg-blue-50",
                (rowIndex % 3 === 0 && rowIndex !== 0) && "border-t-2 border-t-puzzle-dark",
                (colIndex % 3 === 0 && colIndex !== 0) && "border-l-2 border-l-puzzle-dark",
                isCellHighlighted(rowIndex, colIndex) && "animate-pulse-once bg-green-100"
              )}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {!isEmpty && cell}
            </div>
          );
        })
      )}
    </div>
  );
};
