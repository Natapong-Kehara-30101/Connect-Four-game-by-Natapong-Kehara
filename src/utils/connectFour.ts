import { BoardState, CellCoord, Player, WinResult } from '../types';

export const ROWS = 6;
export const COLS = 7;

export function createEmptyBoard(): BoardState {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

export function getLowestEmptyRow(board: BoardState, col: number): number | -1 {
  if (col < 0 || col >= COLS) return -1;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === null) {
      return r;
    }
  }
  return -1;
}

export function isBoardFull(board: BoardState): boolean {
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === null) return false;
  }
  return true;
}

export function checkWinner(board: BoardState): WinResult | null {
  // Horizontal check
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const p = board[r][c];
      if (p && p === board[r][c + 1] && p === board[r][c + 2] && p === board[r][c + 3]) {
        return {
          winner: p,
          line: [
            { row: r, col: c },
            { row: r, col: c + 1 },
            { row: r, col: c + 2 },
            { row: r, col: c + 3 },
          ],
        };
      }
    }
  }

  // Vertical check
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r <= ROWS - 4; r++) {
      const p = board[r][c];
      if (p && p === board[r + 1][c] && p === board[r + 2][c] && p === board[r + 3][c]) {
        return {
          winner: p,
          line: [
            { row: r, col: c },
            { row: r + 1, col: c },
            { row: r + 2, col: c },
            { row: r + 3, col: c },
          ],
        };
      }
    }
  }

  // Diagonal Down-Right (\) check
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const p = board[r][c];
      if (p && p === board[r + 1][c + 1] && p === board[r + 2][c + 2] && p === board[r + 3][c + 3]) {
        return {
          winner: p,
          line: [
            { row: r, col: c },
            { row: r + 1, col: c + 1 },
            { row: r + 2, col: c + 2 },
            { row: r + 3, col: c + 3 },
          ],
        };
      }
    }
  }

  // Diagonal Up-Right (/) check
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const p = board[r][c];
      if (p && p === board[r - 1][c + 1] && p === board[r - 2][c + 2] && p === board[r - 3][c + 3]) {
        return {
          winner: p,
          line: [
            { row: r, col: c },
            { row: r - 1, col: c + 1 },
            { row: r - 2, col: c + 2 },
            { row: r - 3, col: c + 3 },
          ],
        };
      }
    }
  }

  return null;
}
