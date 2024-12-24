export interface AppearanceSettings {
  animations: boolean;
  glassFactor: number; // 0-100
  blurStrength: number; // 0-20
}

export interface AppearanceState extends AppearanceSettings {
  updateSettings: (settings: Partial<AppearanceSettings>) => void;
}