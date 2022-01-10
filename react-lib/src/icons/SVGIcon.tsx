import React from 'react';
import s from './SVGIcon.module.css';

export type SvgIconProps = {
  svg: string
}

const SvgIcon = (props: SvgIconProps) => {
  return (<div className={s.svgIcon} dangerouslySetInnerHTML={{ __html: props.svg }}></div>);
}

export default SvgIcon;
