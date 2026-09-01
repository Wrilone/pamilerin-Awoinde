import React, { useState } from 'react';
import { GameProvider, useGame } from './state/GameProvider';
import { Header } from './components/Header/Header';
import { GlassPanel } from './components/GlassPanel/GlassPanel';
import { ModePicker } from './components/ModePicker/ModePicker';
import { Scoreboard } from './components/Scoreboard/Scoreboard';
import { ResultBanner } from './components/ResultBanner/ResultBanner';
import { Board } from './components/Board/Board';
import styles from './App.module.css';

const GameMain: React.FC = () => {
  const { state, nextRound, undo, resetScore } = useGame();
  const { mode, history, status, announcement, score } = state;
  const [isResetConfirming, setIsResetConfirming] = useState(false);

  const isGameOver = status.kind === 'won' || status.kind === 'draw';
  const canUndo = mode === 'local' && history.length > 0 && status.kind === 'playing';
  const hasScoreToReset = score.X > 0 || score.O > 0 || score.draws > 0;

  const handleResetClick = () => {
    setIsResetConfirming(true);
  };

  const handleConfirmReset = () => {
    resetScore();
    setIsResetConfirming(false);
  };

  const handleCancelReset = () => {
    setIsResetConfirming(false);
  };

  return (
    <main className={styles.container}>
      {/* Header with brand and sound toggle */}
      <Header />

      {/* Main Glass Game Panel */}
      <GlassPanel>
        {/* Mode and Difficulty Picker */}
        <ModePicker />

        {/* Live Scoreboard */}
        <Scoreboard />

        {/* Status / Result notification banner */}
        <ResultBanner />

        {/* 3x3 Accessible Game Board */}
        <Board />

        {/* Action buttons */}
        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={nextRound}
          >
            {isGameOver ? 'Play again' : 'Restart round'}
          </button>

          {mode === 'local' && (
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={undo}
              disabled={!canUndo}
              aria-label="Undo last move"
            >
              Undo move
            </button>
          )}

          {!isResetConfirming && hasScoreToReset && (
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleResetClick}
            >
              Reset score
            </button>
          )}
        </div>

        {/* Inline Score Reset Confirmation */}
        {isResetConfirming && (
          <div className={styles.inlineConfirm} role="alert">
            <span className={styles.confirmText}>Reset score to zero?</span>
            <button
              type="button"
              className={styles.confirmBtn}
              onClick={handleConfirmReset}
            >
              Confirm
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleCancelReset}
            >
              Cancel
            </button>
          </div>
        )}
      </GlassPanel>

      {/* Single Polite ARIA Live Region for all game announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <footer className={styles.footer}>
        Crafted with <strong>Pamilerin</strong> glassmorphic design
      </footer>
    </main>
  );
};

function App() {
  return (
    <div className="app-shell">
      {/* Moving Ambient Depth Orbs for genuine glassmorphism */}
      <div className="ambient-background" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <GameProvider>
        <GameMain />
      </GameProvider>
    </div>
  );
}

export default App;
