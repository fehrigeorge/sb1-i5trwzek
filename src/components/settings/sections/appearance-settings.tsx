import { useAppearance } from '@/stores/appearance';
import { useTheme } from '@/stores/theme';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

export function AppearanceSettings() {
  const { animations, glassFactor, blurStrength, updateSettings } = useAppearance();
  const { mode, setTheme } = useTheme();

  return (
    <div className="space-y-8">
      {/* Theme Selection */}
      <section className="space-y-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase">Theme</h3>
        <div className="grid grid-cols-2 gap-3">
          {['light', 'dark', 'catppuccin', 'dracula'].map((theme) => (
            <button
              key={theme}
              onClick={() => setTheme(theme as any)}
              className={`p-4 rounded-lg border transition-colors ${
                mode === theme
                  ? 'border-blue-500/50 bg-gray-800/50'
                  : 'border-gray-800/50 hover:border-gray-700/50'
              }`}
            >
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-200 capitalize">
                  {theme}
                </div>
                <div className="space-y-1">
                  <div className={`h-1.5 w-8 rounded-full ${
                    theme === 'light' ? 'bg-blue-500' :
                    theme === 'dark' ? 'bg-purple-500' :
                    theme === 'catppuccin' ? 'bg-pink-500' :
                    'bg-red-500'
                  }`} />
                  <div className={`h-1.5 w-12 rounded-full opacity-50 ${
                    theme === 'light' ? 'bg-blue-500' :
                    theme === 'dark' ? 'bg-purple-500' :
                    theme === 'catppuccin' ? 'bg-pink-500' :
                    'bg-red-500'
                  }`} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Effects */}
      <section className="space-y-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase">Effects</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-200">Animations</h4>
            <p className="text-sm text-gray-400">Enable smooth transitions</p>
          </div>
          <Switch
            checked={animations}
            onChange={(checked) => updateSettings({ animations: checked })}
          />
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-200 mb-4">Glass Effect</h4>
            <Slider
              label="Transparency"
              value={glassFactor}
              onChange={(value) => updateSettings({ glassFactor: value })}
              className="mb-4"
            />
            <Slider
              label="Blur Strength"
              value={blurStrength}
              onChange={(value) => updateSettings({ blurStrength: value })}
              min={0}
              max={20}
            />
          </div>
        </div>
      </section>
    </div>
  );
}