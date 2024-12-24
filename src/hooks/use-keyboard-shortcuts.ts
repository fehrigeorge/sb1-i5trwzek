import { useEffect } from 'react';
import { useSettings } from '@/stores/settings';

interface KeyboardShortcut {
  key: string;
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    meta?: boolean;
  };
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts() {
  const { open, close, isOpen } = useSettings();

  useEffect(() => {
    const shortcuts: KeyboardShortcut[] = [
      {
        key: 'k',
        modifiers: { ctrl: true },
        action: open,
        description: 'Open settings (Ctrl + K)',
      },
      {
        key: 'k',
        modifiers: { alt: true },
        action: open,
        description: 'Open settings (Alt + K)',
      },
      {
        key: 'k',
        modifiers: { meta: true },
        action: open,
        description: 'Open settings (Cmd + K)',
      },
      {
        key: 'Escape',
        action: close,
        description: 'Close modal',
      },
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input/textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // Find matching shortcut
      const shortcut = shortcuts.find(
        (s) =>
          s.key.toLowerCase() === e.key.toLowerCase() &&
          (!s.modifiers ||
            ((!s.modifiers.ctrl || e.ctrlKey) &&
              (!s.modifiers.alt || e.altKey) &&
              (!s.modifiers.meta || e.metaKey)))
      );

      if (shortcut) {
        e.preventDefault();
        if (shortcut.key === 'Escape' && !isOpen) return;
        shortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, close, isOpen]);
}