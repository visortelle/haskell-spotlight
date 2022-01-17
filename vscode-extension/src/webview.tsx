import * as lib from "@hackage-ui/react-lib";
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { applyStyles } from '../styles';

const WebViewContent = () => {
  const stylesContainerRef = useRef(null);

  useEffect(() => {
    if (stylesContainerRef) {
      applyStyles(stylesContainerRef.current);
    }
  }, [stylesContainerRef]);

  return (
    <>
      <div ref={stylesContainerRef}></div>
      <lib.appContext.DefaultAppContextProvider useNextJSRouting={false} asWebExtension={true}>
        <lib.searchInput.SearchInput
          asEmbeddedWidget={true}
          api={{
            hackageApiUrl: 'https://hackage-ui.vercel.app/api/hackage',
            hoogleApiUrl: 'https://hackage-ui.vercel.app/api/hoogle'
          }}
        />
      </lib.appContext.DefaultAppContextProvider>
    </>
  );
}

function render() {
  const container = document.getElementById('app');
  ReactDOM.render(<WebViewContent />, container);
}

render();
