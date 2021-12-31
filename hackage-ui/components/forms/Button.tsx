import { ButtonHTMLAttributes, StyleHTMLAttributes } from 'react';
import s from './Button.module.css';

type Props = {
  text: string,
  onClick: () => void
  type: 'regularButton' | 'promoButton',
  tabIndex?: number,
  overrides?: ButtonHTMLAttributes<HTMLButtonElement>
};

const Button = (props: Props) => {
  return (
    <button type="button" className={s[props.type]} tabIndex={props.tabIndex} {...props.overrides}>{props.text}</button>
  );
}

export default Button;
