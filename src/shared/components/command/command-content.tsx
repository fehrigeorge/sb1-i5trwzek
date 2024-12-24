import { X } from 'lucide-react';
import { CommandSection } from './command-modal';
import { GeneralSection } from './sections/general-section';
import { AppearanceSection } from './sections/appearance-section';
import { AdminSection } from './sections/admin-section';

interface CommandContentProps {
  section: CommandSection;
  onClose: () => void;
}

export function CommandContent({ section, onClose }: CommandContentProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
        <h2 className="text-lg font-semibold text-gray-200">
          {section === 'general' && 'General Settings'}
          {section === 'appearance' && 'Appearance Settings'}
          {section === 'admin' && 'Admin Settings'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {section === 'general' && <GeneralSection />}
        {section === 'appearance' && <AppearanceSection />}
        {section === 'admin' && <AdminSection />}
      </div>
    </div>
  );
}