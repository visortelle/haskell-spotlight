import React from 'react';
import ReactDOM from 'react-dom';
import Content from './Content';

export function render({ to }: { to: HTMLElement }) {
  // XXX - Fix for the hacky SearchInput build from NextJS.
  const nextData = document.createElement('div');
  nextData.id = '__NEXT_DATA__';
  nextData.textContent = null;
  document.body.appendChild(nextData);


  ReactDOM.render(<Content />, to);
}
