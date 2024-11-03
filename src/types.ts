export type Cell = 'black' | 'white' | null;
export type GameMode = 'pvp' | 'ai';

export interface GameState {
  board: Cell[][];
  currentPlayer: 'black' | 'white';
  lastMove: [number, number] | null;
}