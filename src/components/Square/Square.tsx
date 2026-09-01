import React, { forwardRef } from 'react';
import type { Cell } from '../../game/engine';
import { Mark } from '../Mark/Mark';
import styles from './Square.module.css';

interface SquareProps {
  index: number;
  cell: Cell;
  isWinningSquare: boolean;
  tabIndex: number;
  disabled: boolean;
  onClick: (index: number) => void;
  onKeyDown: (event: React.KeyboardEvent, index: number) => void;
  onFocus: (index: number) => void;
}

export const Square = forwardRef<HTMLButtonElement, SquareProps>(
  (
    {
      index,
      cell,
      isWinningSquare,
      tabIndex,
      disabled,
      onClick,
      onKeyDown,
      onFocus,
    },
    ref
  ) => {
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    const accessibleLabel = `Row ${row}, column ${col}, ${cell ? cell : 'empty'}`;

    return (
      <button
        ref={ref}
        type="button"
        role="gridcell"
        tabIndex={tabIndex}
        aria-label={accessibleLabel}
        disabled={disabled}
        className={`${styles.square} ${cell ? styles.filled : ''} ${
          isWinningSquare ? styles.winner : ''
        }`}
        onClick={() => onClick(index)}
        onKeyDown={(e) => onKeyDown(e, index)}
        onFocus={() => onFocus(index)}
      >
        {cell && <Mark player={cell} />}
      </button>
    );
  }
);

Square.displayName = 'Square';

