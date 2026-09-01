import React from 'react';
import { useGame } from '../../state/GameProvider';
import styles from './Scoreboard.module.css';

export const Scoreboard: React.FC = () => {
  const { state } = useGame();
  const { score, status, mode, humanPlays } = state;

  const currentTurn =
    status.kind === 'playing' || status.kind === 'thinking' ? status.turn : null;

  const isXTurn = currentTurn === 'X';
  const isOTurn = currentTurn === 'O';

  const labelX = mode === 'computer' ? (humanPlays === 'X' ? 'You (X)' : 'AI (X)') : 'Player X';
  const labelO = mode === 'computer' ? (humanPlays === 'O' ? 'You (O)' : 'AI (O)') : 'Player O';

  const hasPlayedRounds = score.X > 0 || score.O > 0 || score.draws > 0;

  return (
    <div>
      <div className={styles.scoreRow} aria-label="Current match score">
        {/* X Score Pill */}
        <div className={`${styles.pill} ${isXTurn ? styles.activePill : ''}`}>
          {isXTurn && <span className={styles.turnIndicator} aria-hidden="true" />}
          <span className={`${styles.pillLabel} ${styles.labelX}`}>{labelX}</span>
          <span className={styles.pillCount}>{score.X}</span>
        </div>

        {/* Draws Score Pill */}
        <div className={styles.pill}>
          <span className={styles.pillLabel}>Draws</span>
          <span className={styles.pillCount}>{score.draws}</span>
        </div>

        {/* O Score Pill */}
        <div className={`${styles.pill} ${isOTurn ? styles.activePill : ''}`}>
          {isOTurn && <span className={styles.turnIndicator} aria-hidden="true" />}
          <span className={`${styles.pillLabel} ${styles.labelO}`}>{labelO}</span>
          <span className={styles.pillCount}>{score.O}</span>
        </div>
      </div>

      {!hasPlayedRounds && (
        <p className={styles.sessionEmpty}>No rounds played yet</p>
      )}
    </div>
  );
};

