import React from 'react';
import { type Cell } from '../types';

interface BoardProps {
  board: Cell[][];
  onCellClick: (row: number, col: number) => void;
  winningCells: [number, number][];
  lastMove: [number, number] | null;
}

export function Board({ board, onCellClick, winningCells, lastMove }: BoardProps) {
  const isWinningCell = (row: number, col: number) => {
    return winningCells.some(([r, c]) => r === row && c === col);
  };

  const isLastMove = (row: number, col: number) => {
    return lastMove && lastMove[0] === row && lastMove[1] === col;
  };

  return (
    <div className="relative bg-amber-100 p-4 rounded-lg shadow-xl">
      <div className="grid gap-px">
        {board.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => (
              <button
                key={`${i}-${j}`}
                className={`w-10 h-10 relative flex items-center justify-center transition-all duration-200
                  ${i === 0 ? 'rounded-t' : ''} 
                  ${i === board.length - 1 ? 'rounded-b' : ''}
                  ${j === 0 ? 'rounded-l' : ''}
                  ${j === row.length - 1 ? 'rounded-r' : ''}
                  ${isWinningCell(i, j) ? 'bg-green-200' : 'hover:bg-amber-50'}`}
                onClick={() => onCellClick(i, j)}
                disabled={cell !== null}
              >
                {cell !== null && (
                  <div
                    className={`w-8 h-8 rounded-full transform transition-all duration-300 
                      ${cell === 'black' ? 'bg-gray-800' : 'bg-white border-2 border-gray-300'}
                      ${isWinningCell(i, j) ? 'scale-90' : 'scale-85'}
                      ${isLastMove(i, j) ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                      shadow-md`}
                  />
                )}
                <div
                  className="absolute inset-0 border-amber-700"
                  style={{
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderRightWidth: j === board[i].length - 1 ? '1px' : '0',
                    borderBottomWidth: i === board.length - 1 ? '1px' : '0',
                  }}
                />
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}