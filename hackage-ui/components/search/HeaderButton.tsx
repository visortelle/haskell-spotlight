import { MouseEventHandler } from 'react';
import SVGIcon from '../icons/SVGIcon';
import s from './HeaderButton.module.css';

export type HeaderButtonProps = {
  onClick: MouseEventHandler<HTMLDivElement>,
  svgIcon?: string,
  text?: string,
}

const HeaderButton = (props: HeaderButtonProps) => {
  return (
    <div
      className={`${s.button} ${props.text ? '' : s.buttonWithoutText}`}
      onClick={props.onClick}
    >
      {props.svgIcon && <SVGIcon svg={props.svgIcon} />}
      {props.text && <div>{props.text}</div>}
    </div>
  );
}

export default HeaderButton;
