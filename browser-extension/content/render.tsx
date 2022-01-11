import React from 'react';
import ReactDOM from 'react-dom';
import documentStyles from './document.css';
import Content from './Content';

export function render({ to }: { to: HTMLElement }) {
  ReactDOM.render(<Content rootElement={to} />, to.shadowRoot);
  documentStyles.use();
}
