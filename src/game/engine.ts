export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = readonly [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];
export type WinningLine = readonly [number, number, number];

export interface WinnerResult {
  winner: Player;
  line: WinningLine;
}

export const LINES: readonly WinningLine[] = [
  [0, 1, 2], // Row 0
  [3, 4, 5], // Row 1
  [6, 7, 8], // Row 2
  [0, 3, 6], // Col 0
  [1, 4, 7], // Col 1
  [2, 5, 8], // Col 2
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6], // Diagonal top-right to bottom-left
] as const;

export const createBoard = (): Board => [
  null, null, null,
  null, null, null,
  null, null, null,
];

export const availableMoves = (board: Board): number[] => {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
};

export const applyMove = (board: Board, index: number, player: Player): Board => {
  if (index < 0 || index >= board.length || board[index] !== null) {
    return board;
  }
  const next = [...board] as unknown as [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];
  next[index] = player;
  return next as Board;
};

export const winnerOf = (board: Board): WinnerResult | null => {
  for (const line of LINES) {
    const [a, b, c] = line;
    const mark = board[a];
    if (mark !== null && mark === board[b] && mark === board[c]) {
      return { winner: mark, line };
    }
  }
  return null;
};

export const isDraw = (board: Board): boolean => {
  return board.every((cell) => cell !== null) && winnerOf(board) === null;
};

export const isBoardEmpty = (board: Board): boolean => {
  return board.every((cell) => cell === null);
};

export const isBoardFull = (board: Board): boolean => {
  return board.every((cell) => cell !== null);
};
