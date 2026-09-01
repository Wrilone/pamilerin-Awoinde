import React from 'react';
import type { Player } from '../../game/engine';
import styles from './Mark.module.css';

interface MarkProps {
  player: Player;
}

export const Mark: React.FC<MarkProps> = ({ player }) => {
  return (
    <span
      className={`${styles.mark} ${player === 'X' ? styles.markX : styles.markO}`}
      aria-hidden="true"
    >
      {player}
    </span>
  );
};

