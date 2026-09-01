import { describe, it, expect } from 'vitest';
import { gameReducer, createInitialState } from './reducer';
import type { GameState } from './types';

describe('gameReducer', () => {
  it('initializes with default state', () => {
    const state = createInitialState();
    expect(state.board.every((c) => c === null)).toBe(true);
    expect(state.status.kind).toBe('playing');
    expect(state.score).toEqual({ X: 0, O: 0, draws: 0 });
    expect(state.theme).toBe('dark');
  });

  it('handles PLAY action for alternating turns', () => {
    let state = createInitialState();
    state = { ...state, mode: 'local', status: { kind: 'playing', turn: 'X' } };

    state = gameReducer(state, { type: 'PLAY', index: 0 });
    expect(state.board[0]).toBe('X');
    expect(state.status).toEqual({ kind: 'playing', turn: 'O' });

    state = gameReducer(state, { type: 'PLAY', index: 1 });
    expect(state.board[1]).toBe('O');
    expect(state.status).toEqual({ kind: 'playing', turn: 'X' });
  });

  it('detects a win and updates score', () => {
    let state = createInitialState();
    state = { ...state, mode: 'local', status: { kind: 'playing', turn: 'X' } };

    state = gameReducer(state, { type: 'PLAY', index: 0 }); // X
    state = gameReducer(state, { type: 'PLAY', index: 3 }); // O
    state = gameReducer(state, { type: 'PLAY', index: 1 }); // X
    state = gameReducer(state, { type: 'PLAY', index: 4 }); // O
    state = gameReducer(state, { type: 'PLAY', index: 2 }); // X wins row 0

    expect(state.status.kind).toBe('won');
    if (state.status.kind === 'won') {
      expect(state.status.winner).toBe('X');
      expect(state.status.line).toEqual([0, 1, 2]);
    }
    expect(state.score.X).toBe(1);
    expect(state.score.O).toBe(0);
  });

  it('detects draw and updates score', () => {
    let state = createInitialState();
    state = { ...state, mode: 'local', status: { kind: 'playing', turn: 'X' } };

    // Sequence leading to draw:
    // X(0), O(1), X(2)
    // X(4), O(3), X(5)
    // O(6), X(7), O(8)
    const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
    for (const move of moves) {
      state = gameReducer(state, { type: 'PLAY', index: move });
    }

    expect(state.status.kind).toBe('draw');
    expect(state.score.draws).toBe(1);
  });

  it('supports UNDO in local two player mode', () => {
    let state = createInitialState();
    state = { ...state, mode: 'local', status: { kind: 'playing', turn: 'X' } };

    state = gameReducer(state, { type: 'PLAY', index: 4 });
    expect(state.board[4]).toBe('X');
    expect(state.history).toHaveLength(1);

    state = gameReducer(state, { type: 'UNDO' });
    expect(state.board[4]).toBeNull();
    expect(state.status).toEqual({ kind: 'playing', turn: 'X' });
    expect(state.history).toHaveLength(0);
  });

  it('resets score with RESET_SCORE', () => {
    let state = createInitialState();
    state = { ...state, score: { X: 5, O: 3, draws: 2 } };

    state = gameReducer(state, { type: 'RESET_SCORE' });
    expect(state.score).toEqual({ X: 0, O: 0, draws: 0 });
  });

  it('starts fresh round with NEXT_ROUND preserving score', () => {
    let state = createInitialState();
    state = {
      ...state,
      board: ['X', 'X', 'X', 'O', 'O', null, null, null, null],
      score: { X: 2, O: 1, draws: 0 },
      status: { kind: 'won', winner: 'X', line: [0, 1, 2] },
    };

    state = gameReducer(state, { type: 'NEXT_ROUND' });
    expect(state.board.every((c) => c === null)).toBe(true);
    expect(state.status.kind).toBe('playing');
    expect(state.score).toEqual({ X: 2, O: 1, draws: 0 });
  });

  it('toggles sound mute with TOGGLE_MUTE', () => {
    let state = createInitialState();
    expect(state.muted).toBe(false);

    state = gameReducer(state, { type: 'TOGGLE_MUTE' });
    expect(state.muted).toBe(true);

    state = gameReducer(state, { type: 'TOGGLE_MUTE' });
    expect(state.muted).toBe(false);
  });

  it('toggles theme with TOGGLE_THEME', () => {
    let state = createInitialState();
    expect(state.theme).toBe('dark');

    state = gameReducer(state, { type: 'TOGGLE_THEME' });
    expect(state.theme).toBe('light');

    state = gameReducer(state, { type: 'TOGGLE_THEME' });
    expect(state.theme).toBe('dark');
  });
});
