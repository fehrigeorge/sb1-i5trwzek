import { X } from 'lucide-react';
import { SettingsSidebar } from './settings-sidebar';
import GeneralSettings from './sections/general-settings';
import { AppearanceSettings } from './sections/appearance-settings';
import { AdminSettings } from './sections/admin-settings';
import { useSettings } from '@/stores/settings';
import { useSettingsShortcuts } from '@/hooks/use-settings-shortcuts';
import { useGlass } from '@/hooks/use-glass';
import { useAuth } from '@/lib/auth';

export default function SettingsModal() {
  const { isOpen, activeSection, close } = useSettings();
  const { user } = useAuth();
  const glassStyle = useGlass(1.2);
  
  useSettingsShortcuts();

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="w-full max-w-5xl h-[80vh] rounded-xl border border-gray-800/50 overflow-hidden flex"
        style={glassStyle}
      >
        <SettingsSidebar />
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
            <h2 className="text-xl font-semibold text-gray-100">
              {activeSection === 'general' ? 'General' : 
               activeSection === 'appearance' ? 'Appearance' : 
               'Admin Settings'}
            </h2>
            <button
              onClick={close}
              className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeSection === 'general' && <GeneralSettings />}
            {activeSection === 'appearance' && <AppearanceSettings />}
            {activeSection === 'admin' && user.isAdmin && <AdminSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}
