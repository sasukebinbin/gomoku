import React, { useState, useEffect } from 'react';
import { Board } from './components/Board';
import { GameControls } from './components/GameControls';
import { checkWinner, calculateAIMove } from './utils/gameLogic';
import { useGameHistory } from './hooks/useGameHistory';
import type { Cell, GameMode } from './types';

function App() {
  const BOARD_SIZE = 15;
  const initialBoard = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

  const [winner, setWinner] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);

  const {
    currentState,
    addMove,
    undoSteps,
    canUndo,
    reset: resetHistory,
  } = useGameHistory(initialBoard);

  const { board, currentPlayer, lastMove } = currentState;

  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'white' && !winner) {
      const timer = setTimeout(() => {
        const [row, col] = calculateAIMove(board);
        handleMove(row, col);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, winner]);

  const handleMove = (row: number, col: number) => {
    if (winner || board[row][col] !== null) return;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = currentPlayer;

    const [hasWinner, winningPositions] = checkWinner(
      newBoard,
      row,
      col,
      currentPlayer
    );

    if (hasWinner) {
      setWinner(currentPlayer);
      setWinningCells(winningPositions);
    } else if (newBoard.every((row) => row.every((cell) => cell !== null))) {
      setWinner('draw');
    }

    addMove(
      newBoard,
      currentPlayer === 'black' ? 'white' : 'black',
      [row, col]
    );
  };

  const handleReset = () => {
    resetHistory({
      board: initialBoard,
      currentPlayer: 'black',
      lastMove: null,
    });
    setWinner(null);
    setWinningCells([]);
  };

  const handleGameModeChange = (mode: GameMode) => {
    setGameMode(mode);
    handleReset();
  };

  const handleUndo = () => {
    const stepsToUndo = gameMode === 'ai' ? 2 : 1;
    undoSteps(stepsToUndo);
    setWinner(null);
    setWinningCells([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Gomoku</h1>
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl flex flex-col items-center gap-8">
        <GameControls
          gameMode={gameMode}
          onGameModeChange={handleGameModeChange}
          onReset={handleReset}
          onUndo={handleUndo}
          canUndo={canUndo}
          winner={winner}
          currentPlayer={currentPlayer}
        />
        <Board
          board={board}
          onCellClick={handleMove}
          winningCells={winningCells}
          lastMove={lastMove}
        />
      </div>
    </div>
  );
}

export default App;