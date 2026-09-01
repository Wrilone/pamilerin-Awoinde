import {
  applyMove,
  createBoard,
  winnerOf,
  isDraw,
  type Board,
  type Player,
} from '../game/engine';
import { readStoredState } from '../lib/storage';
import type { Action, GameState, Status, Theme } from './types';

export const createInitialState = (): GameState => {
  const persisted = readStoredState();
  const initialTurn: Player = 'X';
  const isComputerTurn =
    persisted.mode === 'computer' && persisted.humanPlays !== initialTurn;

  const status: Status = isComputerTurn
    ? { kind: 'thinking', turn: initialTurn }
    : { kind: 'playing', turn: initialTurn };

  const announcement = isComputerTurn
    ? 'Game started. Pamilerin is thinking.'
    : `Game started. ${initialTurn} to play.`;

  return {
    board: createBoard(),
    history: [],
    status,
    mode: persisted.mode,
    difficulty: persisted.difficulty,
    humanPlays: persisted.humanPlays,
    score: persisted.score,
    muted: persisted.muted,
    theme: persisted.theme,
    announcement,
  };
};

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START': {
      const initialTurn: Player = 'X';
      const isComputerTurn =
        action.mode === 'computer' && action.humanPlays !== initialTurn;
      const status: Status = isComputerTurn
        ? { kind: 'thinking', turn: initialTurn }
        : { kind: 'playing', turn: initialTurn };

      return {
        ...state,
        board: createBoard(),
        history: [],
        mode: action.mode,
        difficulty: action.difficulty,
        humanPlays: action.humanPlays,
        status,
        announcement: isComputerTurn
          ? 'Game started. Pamilerin is thinking.'
          : `Game started. ${initialTurn} to play.`,
      };
    }

    case 'SET_MODE': {
      if (state.mode === action.mode) return state;
      const initialTurn: Player = 'X';
      const isComputerTurn =
        action.mode === 'computer' && state.humanPlays !== initialTurn;
      const status: Status = isComputerTurn
        ? { kind: 'thinking', turn: initialTurn }
        : { kind: 'playing', turn: initialTurn };

      return {
        ...state,
        mode: action.mode,
        board: createBoard(),
        history: [],
        status,
        announcement: `Mode changed to ${action.mode === 'computer' ? 'versus computer' : 'two player'}. ${initialTurn} to play.`,
      };
    }

    case 'SET_DIFFICULTY': {
      return {
        ...state,
        difficulty: action.difficulty,
        announcement: `Difficulty set to ${action.difficulty}.`,
      };
    }

    case 'SET_HUMAN_PLAYS': {
      if (state.humanPlays === action.player) return state;
      const initialTurn: Player = 'X';
      const isComputerTurn =
        state.mode === 'computer' && action.player !== initialTurn;
      const status: Status = isComputerTurn
        ? { kind: 'thinking', turn: initialTurn }
        : { kind: 'playing', turn: initialTurn };

      return {
        ...state,
        humanPlays: action.player,
        board: createBoard(),
        history: [],
        status,
        announcement: `Playing as ${action.player}. ${initialTurn} to play.`,
      };
    }

    case 'PLAY': {
      if (state.status.kind !== 'playing') {
        return state;
      }
      if (state.board[action.index] !== null) {
        return state;
      }
      if (
        state.mode === 'computer' &&
        state.status.turn !== state.humanPlays
      ) {
        return state;
      }

      const currentTurn = state.status.turn;
      const nextBoard = applyMove(state.board, action.index, currentTurn);
      const nextHistory = [...state.history, state.board];
      const win = winnerOf(nextBoard);

      if (win) {
        const nextScore = {
          ...state.score,
          [win.winner]: state.score[win.winner] + 1,
        };
        const status: Status = {
          kind: 'won',
          winner: win.winner,
          line: win.line,
        };
        const announcement =
          state.mode === 'computer'
            ? win.winner === state.humanPlays
              ? 'You win this round!'
              : 'Pamilerin wins this round!'
            : `${win.winner} wins this round!`;

        return {
          ...state,
          board: nextBoard,
          history: nextHistory,
          status,
          score: nextScore,
          announcement,
        };
      }

      if (isDraw(nextBoard)) {
        const nextScore = {
          ...state.score,
          draws: state.score.draws + 1,
        };
        const status: Status = { kind: 'draw' };
        return {
          ...state,
          board: nextBoard,
          history: nextHistory,
          status,
          score: nextScore,
          announcement: 'Draw. Board is full.',
        };
      }

      const nextTurn: Player = currentTurn === 'X' ? 'O' : 'X';
      const isComputerNext =
        state.mode === 'computer' && nextTurn !== state.humanPlays;
      const status: Status = isComputerNext
        ? { kind: 'thinking', turn: nextTurn }
        : { kind: 'playing', turn: nextTurn };
      const announcement = isComputerNext
        ? 'Pamilerin is thinking'
        : `${nextTurn} to play`;

      return {
        ...state,
        board: nextBoard,
        history: nextHistory,
        status,
        announcement,
      };
    }

    case 'COMPUTER_MOVE': {
      if (state.status.kind !== 'thinking') {
        return state;
      }
      if (state.board[action.index] !== null) {
        return state;
      }

      const computerTurn = state.status.turn;
      const nextBoard = applyMove(state.board, action.index, computerTurn);
      const nextHistory = [...state.history, state.board];
      const win = winnerOf(nextBoard);

      if (win) {
        const nextScore = {
          ...state.score,
          [win.winner]: state.score[win.winner] + 1,
        };
        const status: Status = {
          kind: 'won',
          winner: win.winner,
          line: win.line,
        };
        const announcement =
          win.winner === state.humanPlays
            ? 'You win this round!'
            : 'Pamilerin wins this round!';

        return {
          ...state,
          board: nextBoard,
          history: nextHistory,
          status,
          score: nextScore,
          announcement,
        };
      }

      if (isDraw(nextBoard)) {
        const nextScore = {
          ...state.score,
          draws: state.score.draws + 1,
        };
        const status: Status = { kind: 'draw' };
        return {
          ...state,
          board: nextBoard,
          history: nextHistory,
          status,
          score: nextScore,
          announcement: 'Draw. Board is full.',
        };
      }

      const nextTurn: Player = computerTurn === 'X' ? 'O' : 'X';
      const status: Status = { kind: 'playing', turn: nextTurn };
      return {
        ...state,
        board: nextBoard,
        history: nextHistory,
        status,
        announcement: 'Your turn',
      };
    }

    case 'UNDO': {
      // Undo is only allowed during active play in two player mode, when history exists
      if (
        state.mode !== 'local' ||
        state.status.kind !== 'playing' ||
        state.history.length === 0
      ) {
        return state;
      }

      const previousBoard = state.history[state.history.length - 1];
      const nextHistory = state.history.slice(0, -1);

      // Determine who moved to previousBoard
      const xCount = previousBoard.filter((c) => c === 'X').length;
      const oCount = previousBoard.filter((c) => c === 'O').length;
      const turn: Player = xCount === oCount ? 'X' : 'O';

      return {
        ...state,
        board: previousBoard,
        history: nextHistory,
        status: { kind: 'playing', turn },
        announcement: `Move undone. ${turn} to play.`,
      };
    }

    case 'NEXT_ROUND': {
      const initialTurn: Player = 'X';
      const isComputerTurn =
        state.mode === 'computer' && state.humanPlays !== initialTurn;
      const status: Status = isComputerTurn
        ? { kind: 'thinking', turn: initialTurn }
        : { kind: 'playing', turn: initialTurn };

      return {
        ...state,
        board: createBoard(),
        history: [],
        status,
        announcement: isComputerTurn
          ? 'New round started. Pamilerin is thinking.'
          : `New round started. ${initialTurn} to play.`,
      };
    }

    case 'RESET_SCORE': {
      return {
        ...state,
        score: { X: 0, O: 0, draws: 0 },
        announcement: 'Score reset to zero.',
      };
    }

    case 'TOGGLE_MUTE': {
      const nextMuted = !state.muted;
      return {
        ...state,
        muted: nextMuted,
        announcement: nextMuted ? 'Sound muted' : 'Sound unmuted',
      };
    }

    case 'TOGGLE_THEME': {
      const nextTheme: Theme = state.theme === 'dark' ? 'light' : 'dark';
      return {
        ...state,
        theme: nextTheme,
        announcement: `Theme switched to ${nextTheme} mode`,
      };
    }

    case 'SET_THEME': {
      return {
        ...state,
        theme: action.theme,
        announcement: `Theme set to ${action.theme} mode`,
      };
    }

    default:
      return state;
  }
}
