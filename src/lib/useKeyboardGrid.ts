import { useCallback, useState, useRef, useEffect } from 'react';

export function useKeyboardGrid(initialIndex = 0) {
  const [focusedIndex, setFocusedIndex] = useState(initialIndex);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const setButtonRef = useCallback((index: number, el: HTMLButtonElement | null) => {
    buttonRefs.current[index] = el;
  }, []);

  const focusSquare = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(8, index));
    setFocusedIndex(clamped);
    buttonRefs.current[clamped]?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, currentIndex: number, onSelect: (index: number) => void) => {
      let nextIndex = currentIndex;
      let handled = true;

      switch (event.key) {
        case 'ArrowRight':
          nextIndex = (currentIndex + 1) % 9;
          break;
        case 'ArrowLeft':
          nextIndex = (currentIndex - 1 + 9) % 9;
          break;
        case 'ArrowDown':
          nextIndex = (currentIndex + 3) % 9;
          break;
        case 'ArrowUp':
          nextIndex = (currentIndex - 3 + 9) % 9;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = 8;
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          onSelect(currentIndex);
          return;
        default:
          handled = false;
          break;
      }

      if (handled) {
        event.preventDefault();
        focusSquare(nextIndex);
      }
    },
    [focusSquare]
  );

  return {
    focusedIndex,
    setFocusedIndex,
    setButtonRef,
    focusSquare,
    handleKeyDown,
  };
}

