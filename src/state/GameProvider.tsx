import React, { createContext, useContext, useEffect, useReducer, useCallback, useRef } from 'react';
import { gameReducer, createInitialState } from './reducer';
import type { GameState, Action, Mode, Theme } from './types';
import type { Difficulty } from '../game/ai';
import { chooseMove } from '../game/ai';
import type { Player } from '../game/engine';
import { writeStoredState } from '../lib/storage';
import { playMoveSound, playWinSound, playDrawSound, playButtonSound } from '../lib/sound';

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  playSquare: (index: number) => void;
  undo: () => void;
  nextRound: () => void;
  resetScore: () => void;
  toggleMute: () => void;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setHumanPlays: (player: Player) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const prevStatusKindRef = useRef(state.status.kind);

  // Sync theme to document dataset for CSS tokens
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (state.theme === 'light') {
        document.documentElement.dataset.theme = 'light';
      } else {
        delete document.documentElement.dataset.theme;
      }
    }
  }, [state.theme]);

  // Sync persisted fields to localStorage
  useEffect(() => {
    writeStoredState({
      version: 1,
      score: state.score,
      mode: state.mode,
      difficulty: state.difficulty,
      humanPlays: state.humanPlays,
      muted: state.muted,
      theme: state.theme,
    });
  }, [state.score, state.mode, state.difficulty, state.humanPlays, state.muted, state.theme]);

  // Play sound on status changes (Win / Draw)
  useEffect(() => {
    if (state.status.kind === 'won' && prevStatusKindRef.current !== 'won') {
      playWinSound(state.muted);
    } else if (state.status.kind === 'draw' && prevStatusKindRef.current !== 'draw') {
      playDrawSound(state.muted);
    }
    prevStatusKindRef.current = state.status.kind;
  }, [state.status, state.muted]);

  // AI computer opponent turn orchestration
  useEffect(() => {
    if (state.status.kind !== 'thinking' || state.mode !== 'computer') {
      return;
    }

    const currentTurn = state.status.turn;
    const delay = Math.floor(180 + Math.random() * 250); // 180ms - 430ms organic delay

    const timer = window.setTimeout(() => {
      const bestMove = chooseMove(state.board, currentTurn, state.difficulty);
      if (bestMove >= 0) {
        playMoveSound(currentTurn, state.muted);
        dispatch({ type: 'COMPUTER_MOVE', index: bestMove });
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [state.status, state.mode, state.board, state.difficulty, state.muted]);

  const playSquare = useCallback(
    (index: number) => {
      if (state.status.kind !== 'playing' || state.board[index] !== null) {
        return;
      }
      if (state.mode === 'computer' && state.status.turn !== state.humanPlays) {
        return;
      }
      playMoveSound(state.status.turn, state.muted);
      dispatch({ type: 'PLAY', index });
    },
    [state.status, state.board, state.mode, state.humanPlays, state.muted]
  );

  const undo = useCallback(() => {
    playButtonSound(state.muted);
    dispatch({ type: 'UNDO' });
  }, [state.muted]);

  const nextRound = useCallback(() => {
    playButtonSound(state.muted);
    dispatch({ type: 'NEXT_ROUND' });
  }, [state.muted]);

  const resetScore = useCallback(() => {
    playButtonSound(state.muted);
    dispatch({ type: 'RESET_SCORE' });
  }, [state.muted]);

  const toggleMute = useCallback(() => {
    dispatch({ type: 'TOGGLE_MUTE' });
  }, []);

  const toggleTheme = useCallback(() => {
    playButtonSound(state.muted);
    dispatch({ type: 'TOGGLE_THEME' });
  }, [state.muted]);

  const setTheme = useCallback((theme: Theme) => {
    dispatch({ type: 'SET_THEME', theme });
  }, []);

  const setMode = useCallback((mode: Mode) => {
    dispatch({ type: 'SET_MODE', mode });
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', difficulty });
  }, []);

  const setHumanPlays = useCallback((player: Player) => {
    dispatch({ type: 'SET_HUMAN_PLAYS', player });
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        playSquare,
        undo,
        nextRound,
        resetScore,
        toggleMute,
        toggleTheme,
        setTheme,
        setMode,
        setDifficulty,
        setHumanPlays,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
