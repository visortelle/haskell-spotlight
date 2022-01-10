import { useEffect } from 'react';
import * as s from './Popup.module.css';
import styles from './Popup.module.css';
import normalizeStyles from '../../styles/normalize.css';
import globalsStyles from '../../styles/globals.css';
import fontsStyles from '../../styles/fonts.css';

export default () => {
  useEffect(() => {
    normalizeStyles.use();
    fontsStyles.use();
    globalsStyles.use({ target: document.body });
    styles.use();
  }, []);

  return (
    <div className={s.popup}>
      <div className={s.header}>Haskell Spotlight</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>Close this popup and press</div>
        <div style={{ display: 'flex', marginTop: '8px', justifyContent: 'center' }}>
          <code className={s.kbd}>
            Ctrl
          </code>
          <div style={{ fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64px', padding: '0 16px' }}>+</div>
          <code className={s.kbd}>
            H
          </code>
        </div>

        <a
          style={{ display: 'flex', marginTop: '18px', fontSize: '16px', color: '#5e5086' }}
          href="https://github.com/visortelle/hackage-ui"
          target="__blank"
        >
          github.com/visortelle/hackage-ui
        </a>
      </div>
    </div>
  );
}
