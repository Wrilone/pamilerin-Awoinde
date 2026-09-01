import React from 'react';
import { useGame } from '../../state/GameProvider';
import type { Mode } from '../../state/types';
import type { Difficulty } from '../../game/ai';
import type { Player } from '../../game/engine';
import styles from './ModePicker.module.css';

export const ModePicker: React.FC = () => {
  const { state, setMode, setDifficulty, setHumanPlays } = useGame();
  const { mode, difficulty, humanPlays } = state;

  return (
    <div className={styles.container}>
      {/* Primary Mode Picker: Two player vs Computer */}
      <div className={styles.segmentedRow} role="group" aria-label="Game Mode">
        <button
          type="button"
          className={`${styles.segmentBtn} ${mode === 'local' ? styles.active : ''}`}
          aria-pressed={mode === 'local'}
          onClick={() => setMode('local')}
        >
          Two player
        </button>
        <button
          type="button"
          className={`${styles.segmentBtn} ${mode === 'computer' ? styles.active : ''}`}
          aria-pressed={mode === 'computer'}
          onClick={() => setMode('computer')}
        >
          Vs Computer
        </button>
      </div>

      {/* Sub-controls when in Computer Mode */}
      {mode === 'computer' && (
        <div className={styles.subRow}>
          {/* Difficulty selector */}
          <div className={styles.subGroup} role="group" aria-label="Computer Difficulty">
            <span className={styles.label}>AI:</span>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
              <button
                key={level}
                type="button"
                className={`${styles.miniBtn} ${difficulty === level ? styles.active : ''}`}
                aria-pressed={difficulty === level}
                onClick={() => setDifficulty(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

          {/* First player chooser */}
          <div className={styles.subGroup} role="group" aria-label="Human Player Mark">
            <span className={styles.label}>You play:</span>
            {(['X', 'O'] as Player[]).map((p) => (
              <button
                key={p}
                type="button"
                className={`${styles.miniBtn} ${humanPlays === p ? styles.active : ''}`}
                aria-pressed={humanPlays === p}
                onClick={() => setHumanPlays(p)}
              >
                {p} {p === 'X' ? '(1st)' : '(2nd)'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

