import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useAppearance } from '@/stores/appearance';

export function AppearanceSection() {
  const { animations, glassFactor, blurStrength, updateSettings } =
    useAppearance();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-200">Theme</h3>
        {/* <ThemeSelector /> */}
        themeselect here
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-200">Effects</h3>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-200">Animations</h4>
            <p className="text-sm text-gray-400">
              Enable smooth transitions and effects
            </p>
          </div>
          <Switch
            checked={animations}
            onChange={(checked) => updateSettings({ animations: checked })}
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-200">Glass Effect</h4>
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
    </div>
  );
}
