import { AccountInfo } from './account/account-info';
import { SecuritySettings } from './account/security-settings';
import { DangerZone } from './account/danger-zone';
import { AvatarUpload } from './account/avatar-upload';

export default function GeneralSettings() {
  return (
    <div className="space-y-8">
      <AvatarUpload />
      <AccountInfo />
      <SecuritySettings />
      <DangerZone />
    </div>
  );
}
