import * as lib from "@hackage-ui/react-lib";
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { applyStyles } from '../styles';
import * as s from './webview.module.css';
import styles from './webview.module.css';
import haskellLogo from '!!raw-loader!./haskell-monochrome.svg'

const Spotlight = () => {
  const appContext = useContext(lib.appContext.AppContext);

  return (
    <div className={s.content}>
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
  );
}

const WebView = () => {
  const stylesContainerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (stylesContainerRef) {
      applyStyles(stylesContainerRef.current);
      styles.use(stylesContainerRef.current);

      let extraStyles = document.createElement('style');
      extraStyles.appendChild(document.createTextNode("")); // WebKit hack
      (stylesContainerRef.current as HTMLElement).appendChild(extraStyles);
      extraStyles.sheet.insertRule(`.${lib.searchInput.SearchResultsClassName} { top: 64rem !important; max-height: calc(100vh - 80rem) !important; max-width: calc(100vw - 18rem) !important; width: 100vw !important; left: 50% !important; }`);

      setIsReady(true);
    }
  }, [stylesContainerRef]);

  return (
    <lib.appContext.DefaultAppContextProvider useNextJSRouting={false} asWebExtension={true}>
      <div ref={stylesContainerRef}></div>
      {isReady && <Spotlight />}
    </lib.appContext.DefaultAppContextProvider >
  );
}

function render() {
  const container = document.getElementById('app');
  ReactDOM.render(<WebView />, container);
}

render();
