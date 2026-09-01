import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Pamilerin XO App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('renders the header with brand name, theme toggle, and sound controls', () => {
    render(<App />);
    expect(screen.getByText('pamilerin')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mute sound effects/i })).toBeInTheDocument();
  });

  it('toggles dark and light themes and updates document dataset', () => {
    render(<App />);
    const themeBtn = screen.getByRole('button', { name: /switch to light theme/i });
    expect(themeBtn).toHaveAttribute('aria-pressed', 'false');
    expect(document.documentElement.dataset.theme).toBeUndefined();

    // Toggle to Light
    fireEvent.click(themeBtn);
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByRole('button', { name: /switch to dark theme/i })).toHaveAttribute('aria-pressed', 'true');

    // Toggle back to Dark
    fireEvent.click(screen.getByRole('button', { name: /switch to dark theme/i }));
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  it('renders the 9-cell board with accessible gridcell buttons', () => {
    render(<App />);
    const squares = screen.getAllByRole('gridcell');
    expect(squares).toHaveLength(9);
    expect(squares[0]).toHaveAttribute('aria-label', 'Row 1, column 1, empty');
  });

  it('plays a local two-player game turn by turn', () => {
    render(<App />);
    const squares = screen.getAllByRole('gridcell');

    // Click square 0 for X
    fireEvent.click(squares[0]);
    expect(squares[0]).toHaveAttribute('aria-label', 'Row 1, column 1, X');
    expect(squares[0]).toHaveTextContent('X');

    // Click square 1 for O
    fireEvent.click(squares[1]);
    expect(squares[1]).toHaveAttribute('aria-label', 'Row 1, column 2, O');
    expect(squares[1]).toHaveTextContent('O');
  });

  it('supports undoing a move in local mode', () => {
    render(<App />);
    const squares = screen.getAllByRole('gridcell');
    const undoButton = screen.getByRole('button', { name: /undo last move/i });

    expect(undoButton).toBeDisabled();

    // Make a move
    fireEvent.click(squares[4]);
    expect(squares[4]).toHaveTextContent('X');
    expect(undoButton).not.toBeDisabled();

    // Click undo
    fireEvent.click(undoButton);
    expect(squares[4]).toHaveTextContent('');
    expect(undoButton).toBeDisabled();
  });

  it('declares a winner, highlights winning cells, and increments score', () => {
    render(<App />);
    const squares = screen.getAllByRole('gridcell');

    // X: 0, O: 3, X: 1, O: 4, X: 2 (X wins row 0)
    fireEvent.click(squares[0]); // X
    fireEvent.click(squares[3]); // O
    fireEvent.click(squares[1]); // X
    fireEvent.click(squares[4]); // O
    fireEvent.click(squares[2]); // X wins

    expect(screen.getByText('X wins this round')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument();

    // Check that squares are locked
    fireEvent.click(squares[5]);
    expect(squares[5]).toHaveTextContent('');
  });

  it('shows inline score reset confirmation and resets score upon confirm', () => {
    render(<App />);
    const squares = screen.getAllByRole('gridcell');

    // Win a game to have score
    fireEvent.click(squares[0]); // X
    fireEvent.click(squares[3]); // O
    fireEvent.click(squares[1]); // X
    fireEvent.click(squares[4]); // O
    fireEvent.click(squares[2]); // X wins

    const resetButton = screen.getByRole('button', { name: /reset score/i });
    expect(resetButton).toBeInTheDocument();

    // Click Reset score
    fireEvent.click(resetButton);
    expect(screen.getByText('Reset score to zero?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();

    // Confirm reset
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(screen.queryByText('Reset score to zero?')).not.toBeInTheDocument();
    expect(screen.getByText('No rounds played yet')).toBeInTheDocument();
  });

  it('switches between two player and vs computer modes', () => {
    render(<App />);

    const vsComputerBtn = screen.getByRole('button', { name: /vs computer/i });
    fireEvent.click(vsComputerBtn);

    expect(screen.getByRole('group', { name: /computer difficulty/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /human player mark/i })).toBeInTheDocument();
  });
});
