import { Command } from 'lucide-react';
import { useSettings } from '@/stores/settings';
import { cn } from '@/shared/helpers';
import { useAppearance } from '@/stores/appearance';
import SettingsModal from '../settings/settings-modal';

export function CommandMenu() {
  const { open } = useSettings();
  const { animations } = useAppearance();

  return (
    <>
      <button
        onClick={open}
        className={cn(
          "p-2 rounded-lg hover:bg-gray-800/50",
          animations ? "transition-colors duration-200" : "transition-none"
        )}
        aria-label="Open settings"
      >
        <Command className="w-5 h-5 text-gray-400" />
      </button>

      <SettingsModal />
    </>
  );
}
