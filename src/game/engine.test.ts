import { describe, it, expect } from 'vitest';
import {
  createBoard,
  applyMove,
  winnerOf,
  isDraw,
  availableMoves,
  isBoardEmpty,
  isBoardFull,
  LINES,
  type Board,
} from './engine';

describe('game engine', () => {
  it('creates an empty 9-cell board', () => {
    const board = createBoard();
    expect(board).toHaveLength(9);
    expect(board.every((cell) => cell === null)).toBe(true);
    expect(isBoardEmpty(board)).toBe(true);
    expect(isBoardFull(board)).toBe(false);
    expect(availableMoves(board)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('applies a move immutably', () => {
    const board = createBoard();
    const next = applyMove(board, 4, 'X');
    expect(board[4]).toBeNull();
    expect(next[4]).toBe('X');
    expect(isBoardEmpty(next)).toBe(false);
    expect(availableMoves(next)).toEqual([0, 1, 2, 3, 5, 6, 7, 8]);
  });

  it('rejects moves to already occupied cells', () => {
    const board = applyMove(createBoard(), 0, 'X');
    const invalid = applyMove(board, 0, 'O');
    expect(invalid).toBe(board);
    expect(invalid[0]).toBe('X');
  });

  it('rejects moves outside the board index range', () => {
    const board = createBoard();
    expect(applyMove(board, -1, 'X')).toBe(board);
    expect(applyMove(board, 9, 'X')).toBe(board);
  });

  it('detects all 8 winning lines for both X and O', () => {
    for (const [a, b, c] of LINES) {
      // Test for X
      const boardX: [any, any, any, any, any, any, any, any, any] = [
        null, null, null,
        null, null, null,
        null, null, null,
      ];
      boardX[a] = 'X';
      boardX[b] = 'X';
      boardX[c] = 'X';
      const resultX = winnerOf(boardX as unknown as Board);
      expect(resultX).not.toBeNull();
      expect(resultX?.winner).toBe('X');
      expect(resultX?.line).toEqual([a, b, c]);

      // Test for O
      const boardO: [any, any, any, any, any, any, any, any, any] = [
        null, null, null,
        null, null, null,
        null, null, null,
      ];
      boardO[a] = 'O';
      boardO[b] = 'O';
      boardO[c] = 'O';
      const resultO = winnerOf(boardO as unknown as Board);
      expect(resultO).not.toBeNull();
      expect(resultO?.winner).toBe('O');
      expect(resultO?.line).toEqual([a, b, c]);
    }
  });

  it('identifies an ongoing game with no winner yet', () => {
    const board: Board = [
      'X', 'O', 'X',
      'O', 'X', null,
      null, null, 'O',
    ];
    expect(winnerOf(board)).toBeNull();
    expect(isDraw(board)).toBe(false);
  });

  it('detects a draw when board is full and no winning line exists', () => {
    const drawBoard: Board = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X',
    ];
    expect(winnerOf(drawBoard)).toBeNull();
    expect(isDraw(drawBoard)).toBe(true);
    expect(isBoardFull(drawBoard)).toBe(true);
    expect(availableMoves(drawBoard)).toHaveLength(0);
  });

  it('does not declare draw when board is full but a winning line was made on the final move', () => {
    const winLastMove: Board = [
      'X', 'O', 'X',
      'O', 'X', 'O',
      'O', 'O', 'X',
    ];
    expect(winnerOf(winLastMove)?.winner).toBe('X');
    expect(isDraw(winLastMove)).toBe(false);
  });
});

