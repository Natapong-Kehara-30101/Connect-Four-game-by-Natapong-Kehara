import { BoardState, Player } from '../types';
import { checkWinner, COLS, getLowestEmptyRow, ROWS } from './connectFour';

const AI_PLAYER: Player = 'YELLOW';
const HUMAN_PLAYER: Player = 'RED';

/**
 * Score a window of 4 consecutive cells.
 */
function evaluateWindow(window: (Player)[], piece: Player): number {
  const opponent: Player = piece === AI_PLAYER ? HUMAN_PLAYER : AI_PLAYER;
  let score = 0;

  const pieceCount = window.filter(cell => cell === piece).length;
  const emptyCount = window.filter(cell => cell === null).length;
  const oppCount = window.filter(cell => cell === opponent).length;

  if (pieceCount === 4) {
    score += 100000;
  } else if (pieceCount === 3 && emptyCount === 1) {
    score += 100;
  } else if (pieceCount === 2 && emptyCount === 2) {
    score += 10;
  }

  // Strong penalty to block opponent
  if (oppCount === 3 && emptyCount === 1) {
    score -= 150;
  } else if (oppCount === 2 && emptyCount === 2) {
    score -= 15;
  }

  return score;
}

/**
 * Heuristic evaluation function of the entire board from AI's perspective.
 */
function scorePosition(board: BoardState, piece: Player): number {
  let score = 0;

  // Center column preference (center gives highest tactical flexibility in Connect Four)
  const centerCol = 3;
  let centerCount = 0;
  for (let r = 0; r < ROWS; r++) {
    if (board[r][centerCol] === piece) {
      centerCount++;
    }
  }
  score += centerCount * 6;

  // Horizontal evaluation
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const window = [board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3]];
      score += evaluateWindow(window, piece);
    }
  }

  // Vertical evaluation
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r <= ROWS - 4; r++) {
      const window = [board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c]];
      score += evaluateWindow(window, piece);
    }
  }

  // Positive diagonal (\) evaluation
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const window = [board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3]];
      score += evaluateWindow(window, piece);
    }
  }

  // Negative diagonal (/) evaluation
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const window = [board[r][c], board[r - 1][c + 1], board[r - 2][c + 2], board[r - 3][c + 3]];
      score += evaluateWindow(window, piece);
    }
  }

  return score;
}

/**
 * Get all valid non-full columns ordered from center outward for best alpha-beta pruning.
 */
function getValidLocations(board: BoardState): number[] {
  const validLocations: number[] = [];
  // Center outward column ordering: 3, 2, 4, 1, 5, 0, 6
  const colOrder = [3, 2, 4, 1, 5, 0, 6];
  for (const c of colOrder) {
    if (board[0][c] === null) {
      validLocations.push(c);
    }
  }
  return validLocations;
}

/**
 * Check if the node is terminal (win or tie or no moves).
 */
function isTerminalNode(board: BoardState): boolean {
  const win = checkWinner(board);
  if (win !== null) return true;
  return getValidLocations(board).length === 0;
}

/**
 * Minimax algorithm with Alpha-Beta Pruning.
 */
function minimax(
  board: BoardState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): [number | null, number] {
  const validLocations = getValidLocations(board);
  const isTerminal = isTerminalNode(board);

  if (depth === 0 || isTerminal) {
    if (isTerminal) {
      const win = checkWinner(board);
      if (win) {
        if (win.winner === AI_PLAYER) {
          return [null, 10000000 + depth];
        } else if (win.winner === HUMAN_PLAYER) {
          return [null, -10000000 - depth];
        }
      }
      return [null, 0]; // Game drawn
    } else {
      return [null, scorePosition(board, AI_PLAYER)];
    }
  }

  if (isMaximizing) {
    let value = -Infinity;
    let bestCol = validLocations[0];

    for (const col of validLocations) {
      const row = getLowestEmptyRow(board, col);
      if (row === -1) continue;

      // Simulate move
      board[row][col] = AI_PLAYER;
      const [, newScore] = minimax(board, depth - 1, alpha, beta, false);
      // Undo move
      board[row][col] = null;

      if (newScore > value) {
        value = newScore;
        bestCol = col;
      }
      alpha = Math.max(alpha, value);
      if (alpha >= beta) {
        break; // Alpha-beta cutoff
      }
    }
    return [bestCol, value];
  } else {
    let value = Infinity;
    let bestCol = validLocations[0];

    for (const col of validLocations) {
      const row = getLowestEmptyRow(board, col);
      if (row === -1) continue;

      // Simulate move
      board[row][col] = HUMAN_PLAYER;
      const [, newScore] = minimax(board, depth - 1, alpha, beta, true);
      // Undo move
      board[row][col] = null;

      if (newScore < value) {
        value = newScore;
        bestCol = col;
      }
      beta = Math.min(beta, value);
      if (alpha >= beta) {
        break; // Alpha-beta cutoff
      }
    }
    return [bestCol, value];
  }
}

/**
 * Determine AI's next move based on difficulty.
 */
export function getAIMove(
  board: BoardState,
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM'
): number {
  const currentBoard = board.map(r => [...r]);
  const validLocations = getValidLocations(currentBoard);
  if (validLocations.length === 0) return 3;

  // 1. Immediate Win Check (all difficulties)
  for (const col of validLocations) {
    const row = getLowestEmptyRow(currentBoard, col);
    if (row !== -1) {
      currentBoard[row][col] = AI_PLAYER;
      const win = checkWinner(currentBoard);
      currentBoard[row][col] = null;
      if (win && win.winner === AI_PLAYER) {
        return col; // Take winning move immediately!
      }
    }
  }

  // 2. Immediate Block Opponent Win Check
  if (difficulty !== 'EASY' || Math.random() < 0.6) {
    for (const col of validLocations) {
      const row = getLowestEmptyRow(currentBoard, col);
      if (row !== -1) {
        currentBoard[row][col] = HUMAN_PLAYER;
        const win = checkWinner(currentBoard);
        currentBoard[row][col] = null;
        if (win && win.winner === HUMAN_PLAYER) {
          return col; // Block opponent's immediate winning move!
        }
      }
    }
  }

  // 3. Difficulty handling
  if (difficulty === 'EASY') {
    // Mostly random or center preference
    const centerBias = validLocations.filter(c => c >= 2 && c <= 4);
    if (centerBias.length > 0 && Math.random() < 0.5) {
      return centerBias[Math.floor(Math.random() * centerBias.length)];
    }
    return validLocations[Math.floor(Math.random() * validLocations.length)];
  }

  // 4. Minimax with depth based on difficulty
  const depth = difficulty === 'HARD' ? 5 : 3;

  const minimaxBoard: BoardState = currentBoard.map(row => [...row]);
  const [bestCol] = minimax(minimaxBoard, depth, -Infinity, Infinity, true);

  if (bestCol !== null && validLocations.includes(bestCol)) {
    return bestCol;
  }

  return validLocations[0];
}
