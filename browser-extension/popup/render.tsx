import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './Popup';

export function render({ to }: { to: HTMLElement }) {
  ReactDOM.render(<Popup />, to);
}
