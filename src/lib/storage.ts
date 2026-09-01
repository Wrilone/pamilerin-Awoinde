import type { Mode, Score, Theme } from '../state/types';
import type { Difficulty } from '../game/ai';
import type { Player } from '../game/engine';

const STORAGE_KEY = 'pamilerin-xo:v1';

export interface PersistedState {
  version: 1;
  score: Score;
  mode: Mode;
  difficulty: Difficulty;
  humanPlays: Player;
  muted: boolean;
  theme: Theme;
}

export const defaultPersistedState: PersistedState = {
  version: 1,
  score: { X: 0, O: 0, draws: 0 },
  mode: 'local',
  difficulty: 'medium',
  humanPlays: 'X',
  muted: false,
  theme: 'dark',
};

export const readStoredState = (): PersistedState => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return defaultPersistedState;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPersistedState;

    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    if (!parsed || typeof parsed !== 'object') return defaultPersistedState;

    const mode: Mode = parsed.mode === 'computer' ? 'computer' : 'local';
    const difficulty: Difficulty =
      parsed.difficulty === 'easy' || parsed.difficulty === 'hard' || parsed.difficulty === 'medium'
        ? parsed.difficulty
        : 'medium';
    const humanPlays: Player = parsed.humanPlays === 'O' ? 'O' : 'X';
    const muted = Boolean(parsed.muted);
    const theme: Theme = parsed.theme === 'light' ? 'light' : 'dark';

    const score: Score = {
      X: typeof parsed.score?.X === 'number' && parsed.score.X >= 0 ? parsed.score.X : 0,
      O: typeof parsed.score?.O === 'number' && parsed.score.O >= 0 ? parsed.score.O : 0,
      draws: typeof parsed.score?.draws === 'number' && parsed.score.draws >= 0 ? parsed.score.draws : 0,
    };

    return {
      version: 1,
      mode,
      difficulty,
      humanPlays,
      muted,
      theme,
      score,
    };
  } catch {
    return defaultPersistedState;
  }
};

export const writeStoredState = (state: PersistedState): void => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Graceful degradation when localStorage is full or disabled
  }
};
