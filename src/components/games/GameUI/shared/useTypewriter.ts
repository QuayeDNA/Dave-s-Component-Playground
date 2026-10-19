import { useCallback, useEffect, useRef, useState } from 'react';

export interface TypewriterState {
  displayed: string;
  done: boolean;
  skip: () => void;
}

export function useTypewriter(text: string, speed: number, enabled = true): TypewriterState {
  const [displayed, setDisplayed] = useState(enabled ? '' : text);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!enabled) {
      setDisplayed(text);
      return;
    }

    setDisplayed('');
    let index = 0;

    timerRef.current = window.setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));

      if (index >= text.length && timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, speed);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [text, speed, enabled]);

  const skip = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setDisplayed(text);
  }, [text]);

  return { displayed, done: displayed.length >= text.length, skip };
}
