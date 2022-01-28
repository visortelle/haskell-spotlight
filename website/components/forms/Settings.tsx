import { useState, useContext, useCallback, useRef } from 'react';
import SvgIcon from '../icons/SVGIcon';
import settingIcon from '!!raw-loader!../icons/settings.svg';
import s from './Settings.module.css';

const Settings = () => {
  return (
    <div className={s.settings}>
      <button type="button">Reset</button>
      settings
    </div>
  );
}

export const SettingsButton = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <button type="button" className={s.settingsButton} onClick={() => setShowSettings(!showSettings)}>
      <div className={s.settingsButtonIcon}><SvgIcon svg={settingIcon} /></div>
      {showSettings && (
        <div className={s.settingsButtonPopup}>
          <Settings />
        </div>
      )}
    </button>
  );
}

export default Settings;
