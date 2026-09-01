import React, { useMemo } from 'react';
import { useGame } from '../../state/GameProvider';
import { Square } from '../Square/Square';
import { useKeyboardGrid } from '../../lib/useKeyboardGrid';
import styles from './Board.module.css';

export const Board: React.FC = () => {
  const { state, playSquare } = useGame();
  const { board, status, mode, humanPlays } = state;

  const {
    focusedIndex,
    setFocusedIndex,
    setButtonRef,
    handleKeyDown,
  } = useKeyboardGrid(0);

  const winningIndices = useMemo(() => {
    if (status.kind === 'won') {
      return new Set(status.line);
    }
    return new Set<number>();
  }, [status]);

  const isBoardInteractive =
    status.kind === 'playing' &&
    (mode === 'local' || status.turn === humanPlays);

  return (
    <div className={styles.boardContainer}>
      <div
        className={styles.board}
        role="grid"
        aria-label="Pamilerin XO 3 by 3 game board"
        aria-rowcount={3}
        aria-colcount={3}
      >
        {board.map((cell, index) => {
          const isWinningSquare = winningIndices.has(index);
          const isOccupied = cell !== null;
          const isDisabled = !isBoardInteractive || isOccupied;
          const tabIndex = focusedIndex === index ? 0 : -1;

          return (
            <Square
              key={index}
              ref={(el) => setButtonRef(index, el)}
              index={index}
              cell={cell}
              isWinningSquare={isWinningSquare}
              tabIndex={tabIndex}
              disabled={isDisabled}
              onClick={playSquare}
              onKeyDown={(e, idx) => handleKeyDown(e, idx, playSquare)}
              onFocus={setFocusedIndex}
            />
          );
        })}
      </div>
    </div>
  );
};

