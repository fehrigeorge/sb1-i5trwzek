import { useState } from 'react';
import { useSettings } from '@/stores/settings';
import { CommandSidebar } from './command-sidebar';
import { CommandContent } from './command-content';
import { cn } from '@/shared/helpers';
import { useAppearance } from '@/stores/appearance';

export type CommandSection = 'general' | 'appearance' | 'admin';

export function CommandModal() {
  const [section, setSection] = useState<CommandSection>('general');
  const { isOpen, close } = useSettings();
  const { animations, glassFactor, blurStrength } = useAppearance();

  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50",
        animations && "animate-in fade-in duration-200"
      )}
      style={{
        backgroundColor: `rgba(0, 0, 0, ${glassFactor * 0.006})`,
        backdropFilter: `blur(${blurStrength}px)`,
      }}
    >
      <div 
        className={cn(
          "container max-w-6xl mx-auto h-full p-4 flex items-center justify-center",
          animations && "animate-in zoom-in-95 duration-200"
        )}
      >
        <div className={cn(
          "w-full h-[80vh] bg-gray-900/95 rounded-xl shadow-2xl overflow-hidden",
          "border border-gray-800/50",
          "flex"
        )}>
          <CommandSidebar currentSection={section} onSelect={setSection} />
          <CommandContent section={section} onClose={close} />
        </div>
      </div>
    </div>
  );
}