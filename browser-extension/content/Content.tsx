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
  const contentRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [explode, setExplode] = useState(false);
  const [toggleKB, setToggleKB] = useState<k.KeyBinding | undefined>();

  useEffect(() => {
    (async () => {
      const keybinding = await k.readKeyBinding('toggleSpotlight');
      setToggleKB(() => keybinding);
    })()
  }, []);

  const toggleVisibility = useCallback((event: KeyboardEvent) => {
    const kb2: k.KeyBinding = {
      code: event.code,
      modifiers: {
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey
      }
    };

    if (k.eqKeyBindings(toggleKB, kb2)) {
      event.preventDefault();
      setIsShow((isShow) => !isShow);
    }
  }, [isShow, setIsShow, toggleKB]);

  // Prevent global page hotkeys when the search input is in focus.
  const handleKeyboardEvents = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsShow(false);
    }

    event.stopPropagation();
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (props.rootElement === event.target || props.rootElement.contains(event.target as Node)) {
      return;
    }

    setIsShow(false);
  }, []);

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }

    document.addEventListener('mousedown', handleClickOutside);
    contentRef.current.addEventListener('keyup', handleKeyboardEvents);
    contentRef.current.addEventListener('keydown', handleKeyboardEvents);
    contentRef.current.addEventListener('keypress', handleKeyboardEvents);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      contentRef?.current?.removeEventListener('keyup', handleKeyboardEvents)
      contentRef?.current?.removeEventListener('keydown', handleKeyboardEvents)
      contentRef?.current?.removeEventListener('keypress', handleKeyboardEvents)
    };
  });

  useEffect(() => {
    document.addEventListener('keyup', toggleVisibility);

    return () => {
      document.removeEventListener('keyup', toggleVisibility)
    };
  }, [toggleKB]);

  useEffect(() => {
    let extraStyles = document.createElement('style');
    extraStyles.appendChild(document.createTextNode("")); // WebKit hack
    (stylesContainerRef.current as HTMLElement).appendChild(extraStyles);
    extraStyles.sheet.insertRule(`.${lib.searchInput.SearchResultsClassName} { top: 72px !important; max-height: calc(100vh - 82px) !important; }`);

    applyStyles(stylesContainerRef.current);
    styles.use({ target: stylesContainerRef.current });

    setIsReady(true);
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
          <div ref={contentRef} className={s.content}>
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
