import { useTheme } from '@/stores/theme';
import { themes } from '@/lib/themes';

export function useThemeClass(variant: keyof typeof themes.dark) {
  const { mode } = useTheme();
  return themes[mode][variant];
}