import React from 'react';
import { Users, Cpu, RotateCcw, Trophy, Undo2 } from 'lucide-react';
import { GameMode } from '../types';

interface GameControlsProps {
  gameMode: GameMode;
  onGameModeChange: (mode: GameMode) => void;
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  winner: string | null;
  currentPlayer: 'black' | 'white';
}

export function GameControls({
  gameMode,
  onGameModeChange,
  onReset,
  onUndo,
  canUndo,
  winner,
  currentPlayer,
}: GameControlsProps) {
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex gap-2">
        <button
          onClick={() => onGameModeChange('pvp')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
            ${
              gameMode === 'pvp'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-indigo-50'
            }`}
        >
          <Users size={20} /> PvP
        </button>
        <button
          onClick={() => onGameModeChange('ai')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
            ${
              gameMode === 'ai'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-indigo-50'
            }`}
        >
          <Cpu size={20} /> vs AI
        </button>
      </div>

      {winner ? (
        <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
          <Trophy size={24} />
          {winner === 'draw' ? "It's a draw!" : `${winner} wins!`}
        </div>
      ) : (
        <div className="text-lg font-medium">
          Current Player:{' '}
          <span className="font-semibold">
            {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}
          </span>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
            ${
              canUndo
                ? 'text-gray-600 hover:text-gray-800'
                : 'text-gray-400 cursor-not-allowed'
            }`}
        >
          <Undo2 size={20} /> Undo
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <RotateCcw size={20} /> Reset
        </button>
      </div>
    </div>
  );
}