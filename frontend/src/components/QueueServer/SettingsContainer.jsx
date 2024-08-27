import React, { useState } from 'react';
import SettingsMetadata from './SettingsMetadata';
import SettingsAudioAlert from './SettingsAudioAlert';
import SettingsScreenLock from './SettingsScreenLock';
import SettingsAuthentication from './SettingsAuthentication';

export default function SettingsContainer() {
  const [selectedSetting, setSelectedSetting] = useState('Metadata');

  const renderSettingContent = () => {
    switch (selectedSetting) {
      case 'Metadata':
        return <SettingsMetadata />;
      case 'Authentication':
        return <SettingsAuthentication />;
      case 'Audio Alerts':
        return <SettingsAudioAlert/>;
      case 'Screen Lock':
        return <SettingsScreenLock />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
        <ul className="w-1/4 max-w-48 flex-shrink-0 p-4 bg-gray-100 h-full overflow-y-scroll rounded-bl-md">
            {['Metadata', 'Authentication', 'Audio Alerts', 'Screen Lock'].map((setting) => (
            <li
                key={setting}
                onClick={() => setSelectedSetting(setting)}
                className={`p-2 cursor-pointer font-semibold text-black ${selectedSetting === setting ? 'bg-indigo-200 rounded-md' : ''} hover:bg-indigo-100`}
            >
                {setting}
            </li>
            ))}
        </ul>


      {/* Content Area */}
      <div className="flex-grow p-4 h-full overflow-y-scroll">
        {renderSettingContent()}
      </div>
    </div>
  );
}
