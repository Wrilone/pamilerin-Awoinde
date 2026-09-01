import { availableMoves, applyMove, type Player, type Board, winnerOf, isDraw } from './engine';

export type Difficulty = 'easy' | 'medium' | 'hard';

// Global cache for computed hard moves: boardString:player -> bestMove
const hardMoveCache = new Map<string, number>();

export const boardToKey = (board: Board): string => board.map((c) => c ?? '-').join('');

/**
 * Minimax recursive algorithm with depth-aware scoring and alpha-beta pruning.
 * Max player is the AI attempting to maximize score.
 */
function minimax(
  board: Board,
  currentTurn: Player,
  aiPlayer: Player,
  depth: number,
  alpha: number,
  beta: number,
): number {
  const win = winnerOf(board);
  if (win) {
    return win.winner === aiPlayer ? 10 - depth : depth - 10;
  }
  if (isDraw(board)) {
    return 0;
  }

  const moves = availableMoves(board);
  const isMaximizing = currentTurn === aiPlayer;
  const nextPlayer: Player = currentTurn === 'X' ? 'O' : 'X';

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const nextBoard = applyMove(board, move, currentTurn);
      const score = minimax(nextBoard, nextPlayer, aiPlayer, depth + 1, alpha, beta);
      maxEval = Math.max(maxEval, score);
      alpha = Math.max(alpha, maxEval);
      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const nextBoard = applyMove(board, move, currentTurn);
      const score = minimax(nextBoard, nextPlayer, aiPlayer, depth + 1, alpha, beta);
      minEval = Math.min(minEval, score);
      beta = Math.min(beta, minEval);
      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }
    return minEval;
  }
}

/**
 * Finds the optimal minimax move for the given player.
 */
export function getHardMove(board: Board, player: Player): number {
  const moves = availableMoves(board);
  if (moves.length === 0) return -1;

  const cacheKey = `${boardToKey(board)}:${player}`;
  const cached = hardMoveCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  // Immediate win check
  for (const move of moves) {
    const nextBoard = applyMove(board, move, player);
    if (winnerOf(nextBoard)?.winner === player) {
      hardMoveCache.set(cacheKey, move);
      return move;
    }
  }

  const opponent: Player = player === 'X' ? 'O' : 'X';

  // Immediate block check
  for (const move of moves) {
    const nextBoard = applyMove(board, move, opponent);
    if (winnerOf(nextBoard)?.winner === opponent) {
      hardMoveCache.set(cacheKey, move);
      return move;
    }
  }

  // If opening on an empty board, center (4) is optimal
  if (moves.length === 9) {
    hardMoveCache.set(cacheKey, 4);
    return 4;
  }

  let bestScore = -Infinity;
  let bestMove = moves[0];

  for (const move of moves) {
    const nextBoard = applyMove(board, move, player);
    const score = minimax(nextBoard, opponent, player, 1, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  hardMoveCache.set(cacheKey, bestMove);
  return bestMove;
}

/**
 * Medium difficulty:
 * 1. Takes an immediate win if available.
 * 2. Blocks an immediate opponent win if available.
 * 3. Falls back to random move.
 */
export function getMediumMove(board: Board, player: Player): number {
  const moves = availableMoves(board);
  if (moves.length === 0) return -1;

  const opponent: Player = player === 'X' ? 'O' : 'X';

  // 1. Check for immediate win
  for (const move of moves) {
    const nextBoard = applyMove(board, move, player);
    if (winnerOf(nextBoard)?.winner === player) {
      return move;
    }
  }

  // 2. Check for immediate block
  for (const move of moves) {
    const nextBoard = applyMove(board, move, opponent);
    if (winnerOf(nextBoard)?.winner === opponent) {
      return move;
    }
  }

  // 3. Fallback to random
  return moves[Math.floor(Math.random() * moves.length)];
}

/**
 * Easy difficulty: Uniformly random legal move.
 */
export function getEasyMove(board: Board): number {
  const moves = availableMoves(board);
  if (moves.length === 0) return -1;
  return moves[Math.floor(Math.random() * moves.length)];
}

/**
 * Main AI move dispatcher.
 */
export function chooseMove(board: Board, player: Player, difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':
      return getEasyMove(board);
    case 'medium':
      return getMediumMove(board, player);
    case 'hard':
      return getHardMove(board, player);
    default:
      return getHardMove(board, player);
  }
}
