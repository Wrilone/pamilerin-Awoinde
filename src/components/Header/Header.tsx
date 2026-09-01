import React from 'react';
import { useGame } from '../../state/GameProvider';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { state, toggleMute, toggleTheme } = useGame();
  const { muted, theme } = state;

  return (
    <header className={`${styles.header} glass`}>
      <div className={styles.brand}>
        <span className={styles.brandName}>
          pamilerin<span className={styles.brandDot}>.</span>
        </span>
        <span className={styles.brandBadge}>xo</span>
      </div>

      <div className={styles.headerActions}>
        {/* Theme Toggle Button */}
        <button
          type="button"
          className={`${styles.actionButton} ${styles.themeButton}`}
          aria-pressed={theme === 'light'}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <span>Light</span>
            </>
          ) : (
            <>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <span>Dark</span>
            </>
          )}
        </button>

        {/* Mute Toggle Button */}
        <button
          type="button"
          className={`${styles.actionButton} ${styles.muteButton}`}
          aria-pressed={muted}
          aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
          onClick={toggleMute}
        >
          {muted ? (
            <>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
              <span>Muted</span>
            </>
          ) : (
            <>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
              <span>Sound</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
