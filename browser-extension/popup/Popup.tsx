import { KeyboardEventHandler, useEffect, useState } from 'react';
import * as s from './Popup.module.css';
import styles from './Popup.module.css';
import { applyStyles } from '../styles';
import * as k from './keybindings';

export default () => {
  const [keyBinding, setKeyBinding] = useState<k.KeyBinding | undefined>();
  const [tmpKeyBinding, setTmpKeyBinding] = useState<k.KeyBinding>({
    code: undefined,
    modifiers: {
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false
    }
  });
  const [state, setState] = useState<'awaitingForNewKeyBinding' | 'awaitingForUserInput' | 'keyBindingUpdated'>('awaitingForNewKeyBinding');

  useEffect(() => {
    applyStyles(document.body);
    styles.use();

    (async () => {
      const kb = await k.readKeyBinding('toggleSpotlight');
      setKeyBinding(kb);
    })()
  }, []);

  const handleKeyUp: React.KeyboardEventHandler = (event): void => {
    event.preventDefault();
    event.stopPropagation();

    const isValidKb = k.validateKeyBinding(tmpKeyBinding);
    if (!isValidKb) {
      return;
    }

    setKeyBinding(tmpKeyBinding);
    k.writeKeyBinding('toggleSpotlight', tmpKeyBinding).then(() => {
      setState('keyBindingUpdated');
    });
  }

  const handleKeyDown: React.KeyboardEventHandler = (event): void => {
    event.stopPropagation();
    event.preventDefault();

    if (state !== 'awaitingForUserInput') {
      return;
    }

    const kb = k.eventToKeyBinding(event);
    setTmpKeyBinding(kb);
  }

  const kb = state === 'awaitingForUserInput' ? tmpKeyBinding : keyBinding;
  return (
    <div
      className={s.popup}
      onKeyUp={handleKeyUp}
      onKeyDown={handleKeyDown}
    >
      <div className={s.header}>Haskell Spotlight</div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: '1 1' }}>
        <div style={{ fontSize: '14px', textAlign: 'center', padding: '0 18px' }}>
          {state === 'awaitingForNewKeyBinding' && <span>Click on the area bellow to change hotkey.</span>}
          {state === 'awaitingForUserInput' && <span>Press key combination.</span>}
          {state === 'keyBindingUpdated' && <span><br /><strong style={{ fontSize: '24px', color: '#5e5086' }}>Refresh the page to apply new hotkey.</strong></span>}
        </div>

        {kb && (
          <div
            className={`${s.kbdKeys} ${state === 'awaitingForUserInput' ? s.kbdKeysAwaiting : ''}`}
            onClick={() => {
              if (state === 'awaitingForNewKeyBinding' || state === 'keyBindingUpdated') {
                setState('awaitingForUserInput')
              } else if (state === 'awaitingForUserInput') {
                setState('awaitingForNewKeyBinding');
              }
            }}
            tabIndex={0}
          >
            <KbdKey name={kb.code} isActive={kb.code !== undefined} />
            <div>
              <KbdKey name="Alt" isActive={kb.modifiers.altKey} />
              <KbdKey name="Ctrl" isActive={kb.modifiers.ctrlKey} />
              <KbdKey name="Meta" isActive={kb.modifiers.metaKey} />
              <KbdKey name="Shift" isActive={kb.modifiers.shiftKey} />
            </div>
          </div>
        )}

        <a
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 12px 32px 12px', fontSize: '16px', fontWeight: 'bold', color: '#5e5086' }}
          href="https://github.com/visortelle/hackage-ui"
          target="__blank"
        >
          ⭐️ github.com/visortelle/hackage-ui
        </a>
      </div>
    </div>
  );
}

const KbdKey = (props: { name: string, isActive: boolean }) => {
  return (
    <div className={s.kbd}>
      <code className={`${s.kbdKey} ${props.isActive ? s.kbdKeyActive : ''}`}>
        {props.name}
      </code>
    </div>
  );
}
