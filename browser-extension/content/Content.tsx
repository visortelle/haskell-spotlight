import * as lib from '@hackage-ui/react-lib';
import normalizeStyles from '../../styles/normalize.css';
import globalsStyles from '../../styles/globals.css';
import fontsStyles from '../../styles/fonts.css';
import reactLibStyles from '@hackage-ui/react-lib/dist/react-lib.css';
import reactToastifyStyles from 'react-toastify/dist/ReactToastify.css';
import styles from './Content.module.css';
import * as s from './Content.module.css';
import haskellLogo from '!!raw-loader!./haskell-monochrome.svg'
import { useCallback, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary'

const Content = (props: { rootElement: HTMLElement }) => {
  const stylesContainerRef = useRef(null);
  const contentRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [explode, setExplode] = useState(false);

  const toggleVisibility = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'h') {
      setIsShow((isShow) => !isShow);
    }
  }, [isShow, setIsShow]);

  // Prevent global page hotkeys when the search input is in focus.
  const handleKeyboardEvents = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsShow(false);
    }

    event.stopPropagation();
  }, []);

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }

    contentRef.current.addEventListener('keyup', handleKeyboardEvents);
    contentRef.current.addEventListener('keydown', handleKeyboardEvents);
    contentRef.current.addEventListener('keypress', handleKeyboardEvents);

    return () => {
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
  }, []);

  useEffect(() => {
    let extraStyles = document.createElement('style');
    extraStyles.appendChild(document.createTextNode("")); // WebKit hack
    (stylesContainerRef.current as HTMLElement).appendChild(extraStyles);
    extraStyles.sheet.insertRule(`.${lib.searchInput.SearchResultsClassName} { top: 72px !important; max-height: calc(100vh - 82px) !important; }`);

    normalizeStyles.use({ target: stylesContainerRef.current });
    fontsStyles.use({ target: document.head });
    globalsStyles.use({ target: stylesContainerRef.current });
    reactLibStyles.use({ target: stylesContainerRef.current });
    reactToastifyStyles.use({ target: stylesContainerRef.current });
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
            <a href="http://hackage-ui.vercel.app/" target='__blank' className={s.logo} dangerouslySetInnerHTML={{ __html: haskellLogo }}></a>
            <lib.searchInputWidget.SearchInputWidget
              searchInputProps={{
                onClickOutside: (event: MouseEvent) => {
                  console.log('a', props.rootElement);
                  console.log('b', event.target);
                  console.log('eq', props.rootElement === event.target);

                  if (event.target !== props.rootElement) {
                    setIsShow(false);
                  }
                },
                api: {
                  // hackageApiUrl: 'https://hackage-ui.vercel.app/api/hackage',
                  // hoogleApiUrl: 'https://hackage-ui.vercel.app/api/hoogle'
                  hackageApiUrl: 'https://hackage-ui-6l1daso7s-visortelle.vercel.app/api/hackage',
                  hoogleApiUrl: 'https://hackage-ui-6l1daso7s-visortelle.vercel.app/api/hoogle',
                }

              }}
              containerProps={{
                style: {
                  flex: '1'
                }
              }}
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default Content;
