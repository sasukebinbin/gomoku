import { useState, useCallback } from 'react';
import { Cell, GameState } from '../types';

export function useGameHistory(initialBoard: Cell[][]) {
  const [history, setHistory] = useState<GameState[]>([
    {
      board: initialBoard,
      currentPlayer: 'black',
      lastMove: null,
    },
  ]);
  const [currentStep, setCurrentStep] = useState(0);

  const getCurrentState = useCallback(() => history[currentStep], [
    history,
    currentStep,
  ]);

  const addMove = useCallback(
    (board: Cell[][], currentPlayer: 'black' | 'white', lastMove: [number, number]) => {
      const newHistory = history.slice(0, currentStep + 1);
      newHistory.push({ board, currentPlayer, lastMove });
      setHistory(newHistory);
      setCurrentStep(newHistory.length - 1);
    },
    [history, currentStep]
  );

  const canUndo = currentStep > 0;

  const undoSteps = useCallback((steps: number = 1) => {
    if (currentStep >= steps) {
      setCurrentStep(currentStep - steps);
    }
  }, [currentStep]);

  const reset = useCallback((initialState: GameState) => {
    setHistory([initialState]);
    setCurrentStep(0);
  }, []);

  return {
    currentState: getCurrentState(),
    addMove,
    undoSteps,
    canUndo,
    reset,
  };
}