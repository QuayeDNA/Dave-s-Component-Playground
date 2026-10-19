import { useEffect, useRef, type RefObject } from 'react';

export type GameKeyHandler = (event: KeyboardEvent) => void;

interface UseGameKeysOptions {
  preventDefault?: string[];
}

export function useGameKeys(
  targetRef: RefObject<HTMLElement>,
  handlers: Record<string, GameKeyHandler>,
  options: UseGameKeysOptions = {},
): void {
  const handlersRef = useRef(handlers);
  const preventRef = useRef<string[]>(options.preventDefault ?? []);

  handlersRef.current = handlers;
  preventRef.current = options.preventDefault ?? [];

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const element = event.target as HTMLElement | null;
      if (element && (element.isContentEditable || element.closest('input, textarea, select'))) {
        return;
      }

      const handler = handlersRef.current[event.key];
      if (!handler) return;

      if (preventRef.current.includes(event.key)) {
        event.preventDefault();
      }
      handler(event);
    };

    target.addEventListener('keydown', onKeyDown);
    return () => target.removeEventListener('keydown', onKeyDown);
  }, [targetRef]);
}
