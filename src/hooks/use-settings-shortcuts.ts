import { useEffect } from 'react';
import { useSettings } from '@/stores/settings';

export function useSettingsShortcuts() {
  const { isOpen, open, close } = useSettings();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input/textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // Handle opening shortcuts (Cmd/Ctrl/Alt + K)
      if (
        e.key.toLowerCase() === 'k' && 
        (e.metaKey || e.ctrlKey || e.altKey)
      ) {
        e.preventDefault();
        open();
      }

      // Handle closing with Escape
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, open, close]);
}