import React, { useMemo } from 'react';
import { useGame } from '../../state/GameProvider';
import styles from './ResultBanner.module.css';

export const ResultBanner: React.FC = () => {
  const { state } = useGame();
  const { status, mode, humanPlays } = state;

  const { text, type } = useMemo(() => {
    switch (status.kind) {
      case 'setup':
        return { text: 'Start game to play', type: 'normal' };
      case 'thinking':
        return { text: 'Pamilerin is thinking…', type: 'thinking' };
      case 'playing': {
        if (mode === 'computer') {
          return {
            text: status.turn === humanPlays ? 'Your turn' : 'Pamilerin is thinking…',
            type: status.turn === humanPlays ? 'normal' : 'thinking',
          };
        }
        return { text: `${status.turn} to play`, type: 'normal' };
      }
      case 'won': {
        if (mode === 'computer') {
          return {
            text: status.winner === humanPlays ? 'You win!' : 'Pamilerin wins!',
            type: 'win',
          };
        }
        return { text: `${status.winner} wins this round`, type: 'win' };
      }
      case 'draw':
        return { text: 'Draw. Board is full.', type: 'draw' };
      default:
        return { text: '', type: 'normal' };
    }
  }, [status, mode, humanPlays]);

  const className = `${styles.banner} ${
    type === 'thinking'
      ? styles.thinking
      : type === 'win'
      ? styles.win
      : type === 'draw'
      ? styles.draw
      : ''
  }`;

  return <div className={className}>{text}</div>;
};

