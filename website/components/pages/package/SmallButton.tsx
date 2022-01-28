import React, { MouseEventHandler } from 'react';
import SVGIcon from '../../icons/SVGIcon';
import s from './SmallButton.module.css';

export type SmallButtonProps = {
  onClick: MouseEventHandler<HTMLDivElement>,
  svgIcon?: string,
  text?: string,
}

const SmallButton = (props: SmallButtonProps) => {
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

export default SmallButton;

