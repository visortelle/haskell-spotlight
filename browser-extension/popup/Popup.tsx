import { KeyboardEventHandler, useEffect, useState } from 'react';
import * as s from './Popup.module.css';
import styles from './Popup.module.css';
import { applyStyles } from '../styles';
import * as k from './keybindings';

export default () => {
  const [keyBinding, setKeyBinding] = useState<k.KeyBinding | undefined>();
  const [state, setState] = useState<'awaitingForNewKeyBinding' | 'awaitingForUserInput' | 'keyBindingUpdated'>('awaitingForNewKeyBinding');

  useEffect(() => {
    applyStyles(document.body);
    styles.use();

    (async () => {
      const kb = await k.readKeyBinding('toggleSpotlight');
      setKeyBinding(kb);
    })()
  }, []);

  const handleKeyUp: KeyboardEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const newKeyBinding = k.eventToKeyBinding(event);
    if (!newKeyBinding) {
      return;
    }

    setKeyBinding(newKeyBinding);
    k.writeKeyBinding('toggleSpotlight', keyBinding).then(() => {
      setState('keyBindingUpdated');
    });
  }

  const handleKeyDown: KeyboardEventHandler = (event) => {
    const newKeyBinding = k.eventToKeyBinding(event, true);
    if (!newKeyBinding) {
      return;
    }
    setKeyBinding(newKeyBinding);
  }

  return (
    <div className={s.popup}>
      <div className={s.header}>Haskell Spotlight</div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: '1 1' }}>
        <div style={{ fontSize: '14px', textAlign: 'center', padding: '0 18px' }}>
          {state === 'awaitingForNewKeyBinding' && <span>Click on the area bellow to change hot key.</span>}
          {state === 'awaitingForUserInput' && <span>Press key combination.</span>}
          {state === 'keyBindingUpdated' && <span>Hot key has been updated. Close the popup and try it on some web page. Try to refresh the page if nothing happens.</span>}
        </div>

        {keyBinding && (
          <div
            className={`${s.kbdKeys} ${state === 'keyBindingUpdated' ? s.kbdKeysCalm : ''} ${state === 'awaitingForUserInput' ? s.kbdKeysAwaiting : ''}`}
            onClick={() => {
              if (state !== 'awaitingForUserInput') {
                setState('awaitingForUserInput')
              } else if (state === 'awaitingForUserInput') {
                if (k.validateKeybinding(keyBinding)) {
                  setState('awaitingForNewKeyBinding');
                }
              }
            }}
            onKeyUp={handleKeyUp}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <KbdKey name={keyBinding.code} isActive={keyBinding.code !== undefined} />
            <div>
              <KbdKey name="Alt" isActive={keyBinding.modifiers.altKey} />
              <KbdKey name="Ctrl" isActive={keyBinding.modifiers.ctrlKey} />
              <KbdKey name="Meta" isActive={keyBinding.modifiers.metaKey} />
              <KbdKey name="Shift" isActive={keyBinding.modifiers.shiftKey} />
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
