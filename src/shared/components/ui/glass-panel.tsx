```typescript
import { useAppearance } from '@/stores/appearance';
import { cn } from '@/shared/helpers';
import { useThemeClass } from '@/hooks/use-theme-class';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function GlassPanel({ children, className, intensity = 'medium' }: GlassPanelProps) {
  const { glassFactor, blurStrength } = useAppearance();
  const borderClass = useThemeClass('border');
  const cardClass = useThemeClass('card');

  const intensityFactors = {
    low: 0.5,
    medium: 1,
    high: 1.5,
  };

  const factor = intensityFactors[intensity];
  const opacity = (glassFactor / 100) * factor;
  const blur = blurStrength * factor;

  return (
    <div
      className={cn(
        "backdrop-blur rounded-xl border",
        cardClass,
        borderClass,
        className
      )}
      style={{
        backdropFilter: `blur(${blur}px)`,
        opacity: opacity,
      }}
    >
      {children}
    </div>
  );
}
```