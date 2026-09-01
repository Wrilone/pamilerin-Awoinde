import { describe, it, expect } from 'vitest';
import { chooseMove, getHardMove, getMediumMove, getEasyMove, boardToKey } from './ai';
import {
  createBoard,
  applyMove,
  winnerOf,
  isDraw,
  availableMoves,
  type Board,
} from './engine';

describe('AI Opponent', () => {
  describe('Easy mode', () => {
    it('returns a legal available move', () => {
      const board = createBoard();
      const move = getEasyMove(board);
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThanOrEqual(8);
      expect(board[move]).toBeNull();
    });

    it('returns -1 on full board', () => {
      const fullBoard: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
      expect(getEasyMove(fullBoard)).toBe(-1);
    });
  });

  describe('Medium mode', () => {
    it('takes an immediate win if available', () => {
      const board: Board = [
        'O', 'O', null,
        'X', 'X', null,
        null, null, null,
      ];
      const move = getMediumMove(board, 'O');
      expect(move).toBe(2);
    });

    it('blocks opponent from immediate win if available', () => {
      const board: Board = [
        'X', 'X', null,
        'O', null, null,
        null, null, null,
      ];
      const move = getMediumMove(board, 'O');
      expect(move).toBe(2);
    });
  });

  describe('Hard mode (Minimax Unbeatable)', () => {
    it('takes an immediate win', () => {
      const board: Board = [
        'X', 'X', null,
        'O', 'O', null,
        null, null, null,
      ];
      const move = getHardMove(board, 'X');
      expect(move).toBe(2);
    });

    it('blocks opponent winning move', () => {
      const board: Board = [
        'X', 'X', null,
        null, 'O', null,
        null, null, null,
      ];
      const move = getHardMove(board, 'O');
      expect(move).toBe(2);
    });

    it('never loses when human is X and AI is O (exhaustive search)', () => {
      const visited = new Set<string>();

      function simulateAllHumanMoves(board: Board): void {
        const boardKey = boardToKey(board);
        if (visited.has(boardKey)) return;
        visited.add(boardKey);

        const win = winnerOf(board);
        if (win) {
          expect(win.winner).not.toBe('X');
          return;
        }
        if (isDraw(board)) {
          return;
        }

        const humanMoves = availableMoves(board);
        for (const hMove of humanMoves) {
          const boardAfterHuman = applyMove(board, hMove, 'X');
          const humanWin = winnerOf(boardAfterHuman);
          if (humanWin) {
            expect(humanWin.winner).not.toBe('X');
            return;
          }
          if (isDraw(boardAfterHuman)) {
            continue;
          }

          const aiMove = chooseMove(boardAfterHuman, 'O', 'hard');
          expect(aiMove).toBeGreaterThanOrEqual(0);
          const boardAfterAI = applyMove(boardAfterHuman, aiMove, 'O');
          simulateAllHumanMoves(boardAfterAI);
        }
      }

      simulateAllHumanMoves(createBoard());
    });

    it('never loses when AI is X and Human is O (exhaustive search)', () => {
      const visited = new Set<string>();

      function simulateAllAiFirst(board: Board): void {
        const boardKey = boardToKey(board);
        if (visited.has(boardKey)) return;
        visited.add(boardKey);

        const win = winnerOf(board);
        if (win) {
          expect(win.winner).not.toBe('O');
          return;
        }
        if (isDraw(board)) {
          return;
        }

        const aiMove = chooseMove(board, 'X', 'hard');
        expect(aiMove).toBeGreaterThanOrEqual(0);
        const boardAfterAI = applyMove(board, aiMove, 'X');

        const aiWin = winnerOf(boardAfterAI);
        if (aiWin) {
          expect(aiWin.winner).toBe('X');
          return;
        }
        if (isDraw(boardAfterAI)) {
          return;
        }

        const humanMoves = availableMoves(boardAfterAI);
        for (const hMove of humanMoves) {
          const boardAfterHuman = applyMove(boardAfterAI, hMove, 'O');
          simulateAllAiFirst(boardAfterHuman);
        }
      }

      simulateAllAiFirst(createBoard());
    });
  });
});

