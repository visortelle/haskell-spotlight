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

const Content = (props: { rootElement: HTMLElement }) => {
  const stylesContainerRef = useRef(null);
  const contentRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isShow, setIsShow] = useState(false);

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
    normalizeStyles.use({ target: stylesContainerRef.current });
    fontsStyles.use({ target: stylesContainerRef.current });
    globalsStyles.use({ target: stylesContainerRef.current });
    reactLibStyles.use({ target: stylesContainerRef.current });
    reactToastifyStyles.use({ target: stylesContainerRef.current });
    styles.use({ target: stylesContainerRef.current });

    setIsReady(true);
  }, [stylesContainerRef]);

  return (
    <div>
      <div ref={stylesContainerRef}></div>
      {isReady && isShow && (
        <div ref={contentRef} className={s.content}>
          <a href="http://hackage-ui.vercel.app/" target='__blank' className={s.logo} dangerouslySetInnerHTML={{ __html: haskellLogo }}></a>
          <lib.searchInputWidget.SearchInputWidget
            searchInputProps={{
              onClickOutside: (event: MouseEvent) => {
                if (event.target !== props.rootElement) {
                  setIsShow(false);
                }
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
  );
}

export default Content;
