import { useAppearance } from '@/stores/appearance';

interface GlassStyle {
  backgroundColor: string;
  backdropFilter: string;
}

export function useGlass(intensity: number = 1): GlassStyle {
  const { glassFactor, blurStrength } = useAppearance();
  
  return {
    backgroundColor: `rgba(17, 24, 39, ${(glassFactor / 100) * intensity})`,
    backdropFilter: `blur(${blurStrength * intensity}px)`,
  };
}