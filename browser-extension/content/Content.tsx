import * as lib from '@hackage-ui/react-lib';
import styles from './Content.module.css';
import * as s from './Content.module.css';
import haskellLogo from '!!raw-loader!./haskell-monochrome.svg'
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary'
import * as k from '../popup/keybindings';
import { applyStyles } from '../styles';

const Content = (props: { rootElement: HTMLElement }) => {
  const appContext = useContext(lib.appContext.AppContext);
  const stylesContainerRef = useRef(null);
  const [contentEl, setContentEl] = useState<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [explode, setExplode] = useState(false);
  const [showKB, setShowKB] = useState<k.KeyBinding | undefined>();

  const preventDefaultKeyBehavior = useCallback((event: KeyboardEvent | React.KeyboardEvent) => {
    if (!showKB) {
      return;
    }

    if (!isShow && k.eqKeyBindings(showKB, k.eventToKeyBinding(event))) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, [isShow, showKB]);

  const handleDocumentKeydown = useCallback((event: KeyboardEvent) => {
    if (!isShow && k.eqKeyBindings(showKB, k.eventToKeyBinding(event))) {
      setIsShow(() => true);
    }
  }, [isShow, setIsShow, showKB]);

  // Prevent global page hotkeys when the spotlight popup is in focus.
  const handleKeyboardEvents = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsShow(() => false);
    }

    if (isShow) {
      event.stopPropagation();
    }
  }, [setIsShow, isShow, showKB]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (props.rootElement === event.target || props.rootElement.contains(event.target as Node)) {
      return;
    }

    setIsShow(() => false);
  }, []);

  useEffect(() => {
    (async () => {
      const keybinding = await k.readKeyBinding('toggleSpotlight');
      setShowKB(() => keybinding);
    })()
  }, []);

  useEffect(() => {
    const cleanup = () => {
      document.removeEventListener('keydown', preventDefaultKeyBehavior);
      document.removeEventListener('keyup', preventDefaultKeyBehavior);
    }

    if (!showKB) {
      return;
    }

    document.addEventListener('keydown', preventDefaultKeyBehavior);
    document.addEventListener('keyup', preventDefaultKeyBehavior);

    return cleanup;
  }, [preventDefaultKeyBehavior, showKB]);

  useEffect(() => {
    if (!contentEl) {
      return;
    }

    document.addEventListener('mousedown', handleClickOutside);
    contentEl.addEventListener('keyup', handleKeyboardEvents);
    contentEl.addEventListener('keydown', handleKeyboardEvents);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      contentEl.removeEventListener('keyup', handleKeyboardEvents)
      contentEl.removeEventListener('keydown', handleKeyboardEvents)
    };
  }, [contentEl]);

  useEffect(() => {
    document.addEventListener('keydown', handleDocumentKeydown);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeydown)
    };
  }, [showKB]);

  useEffect(() => {
    let extraStyles = document.createElement('style');
    extraStyles.appendChild(document.createTextNode("")); // WebKit hack
    (stylesContainerRef.current as HTMLElement).appendChild(extraStyles);
    extraStyles.sheet.insertRule(`.${lib.searchInput.SearchResultsClassName} { top: 72px !important; max-height: calc(100vh - 82px) !important; }`);

    applyStyles(stylesContainerRef.current);
    styles.use({ target: stylesContainerRef.current });

    setIsReady(() => true);
  }, [stylesContainerRef]);

  return (
    <ErrorBoundary
      FallbackComponent={() => { return (<div>Something went wrong...</div>) }}
      onReset={() => setExplode(false)}
      resetKeys={[explode]}
    >
      <div>
        <div ref={stylesContainerRef}></div>
        {isReady && isShow && (
          <div ref={setContentEl} className={s.content}>
            <div className={`${s.progressIndicator} ${Object.keys(appContext.tasks).length > 0 ? s.progressIndicatorRunning : ''}`}></div>
            <a href="https://github.com/visortelle/hackage-ui" target='__blank' className={s.logo} dangerouslySetInnerHTML={{ __html: haskellLogo }}></a>
            <div style={{ flex: 1 }}>
              <lib.searchInput.SearchInput
                asEmbeddedWidget={true}
                api={{
                  hackageApiUrl: 'https://hackage-ui.vercel.app/api/hackage',
                  hoogleApiUrl: 'https://hackage-ui.vercel.app/api/hoogle'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default Content;
