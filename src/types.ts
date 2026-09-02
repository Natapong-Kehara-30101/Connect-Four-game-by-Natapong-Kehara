export type Player = 'RED' | 'YELLOW' | null;

export type GameMode = 'PVP' | 'AI';

export type AIDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface CellCoord {
  row: number;
  col: number;
}

export type BoardState = Player[][]; // 6 rows, 7 columns

export interface WinResult {
  winner: 'RED' | 'YELLOW';
  line: CellCoord[];
}

export interface ScoreState {
  red: number;
  yellow: number;
  draws: number;
}

export interface DropAnimation {
  row: number;
  col: number;
  player: 'RED' | 'YELLOW';
}
