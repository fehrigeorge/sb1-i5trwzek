import { User, Palette, Eye } from 'lucide-react';
import { CommandSection } from './command-modal';
import { cn } from '@/shared/helpers';
import { useAuth } from '@/lib/auth';
import { useAdminPreview } from '@/stores/admin-preview';

interface CommandSidebarProps {
  currentSection: CommandSection;
  onSelect: (section: CommandSection) => void;
}

export function CommandSidebar({ currentSection, onSelect }: CommandSidebarProps) {
  const { user } = useAuth();
  const { previewUserMode } = useAdminPreview();
  const isAdmin = user?.isAdmin && !previewUserMode;

  const sections = [
    { id: 'general', label: 'General', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: Eye }] : []),
  ] as const;

  return (
    <div className="w-64 border-r border-gray-800/50">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-200">Settings</h2>
        <p className="text-sm text-gray-400">Customize your experience</p>
      </div>
      
      <nav className="px-2">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm mb-1",
              currentSection === id 
                ? "bg-blue-500/10 text-blue-400" 
                : "text-gray-400 hover:bg-gray-800/50"
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}