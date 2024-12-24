import { createContext, useEffect, PropsWithChildren } from 'react';
import { useTheme } from '@/stores/theme';
import { themes } from '@/lib/themes';

export function ThemeProvider({ children }: PropsWithChildren) {
  const { mode } = useTheme();

  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove(
      ...Object.values(themes).flatMap(theme => Object.values(theme))
    );

    // Add new theme classes
    Object.entries(themes[mode]).forEach(([key, value]) => {
      document.documentElement.classList.add(value);
    });

    // Update meta theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const themeColors = {
      light: '#f9fafb',
      dark: '#030712',
      catppuccin: '#1e1e2e',
      dracula: '#282a36',
    };
    
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColors[mode]);
    }
  }, [mode]);

  return (
    <div className="min-h-screen transition-colors duration-200">
      {children}
    </div>
  );
}