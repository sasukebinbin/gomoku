import { Cell } from '../types';

export function checkWinner(
  board: Cell[][],
  row: number,
  col: number,
  player: Cell
): [boolean, [number, number][]] {
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];
  const size = board.length;

  for (const [dx, dy] of directions) {
    const winningCells: [number, number][] = [[row, col]];
    
    // Check forward
    let count = 1;
    let r = row + dx;
    let c = col + dy;
    while (
      r >= 0 &&
      r < size &&
      c >= 0 &&
      c < size &&
      board[r][c] === player &&
      count < 5
    ) {
      winningCells.push([r, c]);
      count++;
      r += dx;
      c += dy;
    }

    // Check backward
    r = row - dx;
    c = col - dy;
    while (
      r >= 0 &&
      r < size &&
      c >= 0 &&
      c < size &&
      board[r][c] === player &&
      count < 5
    ) {
      winningCells.push([r, c]);
      count++;
      r -= dx;
      c -= dy;
    }

    if (count >= 5) {
      return [true, winningCells];
    }
  }

  return [false, []];
}

export function calculateAIMove(board: Cell[][]): [number, number] {
  const size = board.length;
  const scores = Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));

  // Evaluate each empty cell
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] === null) {
        scores[i][j] = evaluatePosition(board, i, j);
      }
    }
  }

  // Find the cell with the highest score
  let maxScore = -1;
  let bestMove: [number, number] = [0, 0];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] === null && scores[i][j] > maxScore) {
        maxScore = scores[i][j];
        bestMove = [i, j];
      }
    }
  }

  return bestMove;
}

function evaluatePosition(board: Cell[][], row: number, col: number): number {
  let score = 0;
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];

  for (const [dx, dy] of directions) {
    score += evaluateDirection(board, row, col, dx, dy, 'white'); // AI
    score += evaluateDirection(board, row, col, dx, dy, 'black'); // Player
  }

  return score;
}

function evaluateDirection(
  board: Cell[][],
  row: number,
  col: number,
  dx: number,
  dy: number,
  player: Cell
): number {
  const size = board.length;
  let consecutive = 0;
  let blocked = 0;
  let score = 0;

  // Check forward
  let r = row + dx;
  let c = col + dy;
  while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === player) {
    consecutive++;
    r += dx;
    c += dy;
  }
  if (r < 0 || r >= size || c < 0 || c >= size || board[r][c] !== null) {
    blocked++;
  }

  // Check backward
  r = row - dx;
  c = col - dy;
  while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === player) {
    consecutive++;
    r -= dx;
    c -= dy;
  }
  if (r < 0 || r >= size || c < 0 || c >= size || board[r][c] !== null) {
    blocked++;
  }

  // Calculate score based on consecutive pieces and blockage
  if (consecutive >= 4) score += 100000;
  else if (consecutive === 3 && blocked === 0) score += 10000;
  else if (consecutive === 3 && blocked === 1) score += 1000;
  else if (consecutive === 2 && blocked === 0) score += 100;
  else if (consecutive === 2 && blocked === 1) score += 10;
  else if (consecutive === 1) score += 1;

  // Increase score for center positions
  const centerDistance = Math.abs(size / 2 - row) + Math.abs(size / 2 - col);
  score += (size - centerDistance) / 2;

  return score;
}