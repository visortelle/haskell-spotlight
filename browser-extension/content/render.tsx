import React from 'react';
import ReactDOM from 'react-dom';
import documentStyles from './document.css';
import Content from './Content';
import * as lib from '@hackage-ui/react-lib'

export function render({ to }: { to: HTMLElement }) {
  ReactDOM.render(
    (
      <lib.appContext.DefaultAppContextProvider useNextJSRouting={false}>
        <Content rootElement={to} />
      </lib.appContext.DefaultAppContextProvider>
    ),
    to.shadowRoot
  );

  documentStyles.use();
}
