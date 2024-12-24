import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatPreviews } from './use-chat-previews';

export function useSearchFocus() {
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data: previews = [] } = useChatPreviews();
  const selectedRef = useRef<number>(-1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input/textarea
      if (
        (document.activeElement?.tagName === 'INPUT' &&
          document.activeElement !== searchRef.current) ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      // Navigation with arrow keys when search is focused
      if (document.activeElement === searchRef.current) {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            selectedRef.current = Math.min(
              selectedRef.current + 1,
              previews.length - 1
            );
            break;
          case 'ArrowUp':
            e.preventDefault();
            selectedRef.current = Math.max(selectedRef.current - 1, -1);
            break;
          case 'Enter':
            e.preventDefault();
            if (selectedRef.current >= 0 && previews[selectedRef.current]) {
              navigate(`/chats/${previews[selectedRef.current].id}`);
              searchRef.current?.blur();
              selectedRef.current = -1;
            }
            break;
          case 'Escape':
            e.preventDefault();
            searchRef.current?.blur();
            selectedRef.current = -1;
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, previews]);

  return { searchRef, selectedIndex: selectedRef.current };
}
