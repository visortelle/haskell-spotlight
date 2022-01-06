import { MouseEventHandler } from 'react';
import SVGIcon from '../icons/SVGIcon';
import s from './HeaderButton.module.css';

export type HeaderButtonProps = {
  onClick: MouseEventHandler<HTMLDivElement>,
  svgIcon?: string,
  text: string,
}

const HeaderButton = (props: HeaderButtonProps) => {
  return (
    <div
      className={s.button}
      onClick={props.onClick}
    >
      {props.svgIcon && <SVGIcon svg={props.svgIcon} />}
      <div>{props.text}</div>
    </div>
  );
}

export default HeaderButton;
