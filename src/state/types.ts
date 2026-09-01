import type { Board, Player, WinningLine } from '../game/engine';
import type { Difficulty } from '../game/ai';

export type Mode = 'local' | 'computer';
export type Theme = 'dark' | 'light';

export type Status =
  | { kind: 'setup' }
  | { kind: 'playing'; turn: Player }
  | { kind: 'thinking'; turn: Player }
  | { kind: 'won'; winner: Player; line: WinningLine }
  | { kind: 'draw' };

export interface Score {
  X: number;
  O: number;
  draws: number;
}

export interface GameState {
  board: Board;
  history: Board[];
  status: Status;
  mode: Mode;
  difficulty: Difficulty;
  humanPlays: Player;
  score: Score;
  muted: boolean;
  theme: Theme;
  announcement: string;
}

export type Action =
  | { type: 'START'; mode: Mode; difficulty: Difficulty; humanPlays: Player }
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'SET_HUMAN_PLAYS'; player: Player }
  | { type: 'PLAY'; index: number }
  | { type: 'COMPUTER_MOVE'; index: number }
  | { type: 'UNDO' }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESET_SCORE' }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; theme: Theme };
