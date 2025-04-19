
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type PuzzleBoardProps = {
  board: number[][];
  editable?: boolean;
  onTileClick?: (row: number, col: number) => void;
  highlightEmpty?: boolean;
  className?: string;
};

export const PuzzleBoard = ({
  board,
  editable = false,
  onTileClick,
  highlightEmpty = false,
  className,
}: PuzzleBoardProps) => {
  const [animatingTile, setAnimatingTile] = useState<[number, number] | null>(null);
  
  const handleTileClick = (row: number, col: number) => {
    if (editable && onTileClick) {
      setAnimatingTile([row, col]);
      onTileClick(row, col);
      
      setTimeout(() => {
        setAnimatingTile(null);
      }, 300);
    }
  };

  return (
    <div className={cn("grid grid-cols-3 gap-2 w-64 h-64", className)}>
      {board.map((row, rowIndex) =>
        row.map((tile, colIndex) => {
          const isEmpty = tile === 0;
          const isAnimating = animatingTile && 
            animatingTile[0] === rowIndex && 
            animatingTile[1] === colIndex;
          
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "puzzle-tile w-20 h-20 text-2xl",
                isEmpty ? "puzzle-tile-empty" : "puzzle-tile-8",
                editable && !isEmpty && "cursor-pointer hover:scale-105",
                isAnimating && "animate-pulse-once",
                highlightEmpty && isEmpty && "border-puzzle-primary border-2 border-dashed"
              )}
              onClick={() => handleTileClick(rowIndex, colIndex)}
            >
              {!isEmpty && tile}
            </div>
          );
        })
      )}
    </div>
  );
};
