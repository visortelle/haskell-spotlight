import s from './Link.module.css';
import * as lib from '@hackage-ui/react-lib';
import SVGIcon from '../../../icons/SVGIcon';
import openInNewTabIcon from '!!raw-loader!../../../icons/open-in-new-tab.svg';
import { ReactNode } from 'react';

export type LinkProps = {
  text: ReactNode,
  href: string,
  type: 'internal' | 'external',
  openInNewTab: boolean,
  disabled?: boolean
}

const Link = (props: LinkProps) => {
  const _Link = props.type === 'external' ? lib.links.ExtA : lib.links.A;

  return (
    <_Link
      className={`${s.link} ${props.disabled ? s.linkDisabled : ''}`}
      href={props.href}
      analytics={{ featureName: `LinkClick`, eventParams: { event_label: props.href } }}
      target={props.openInNewTab ? '_blank' : '_self'}
      tabIndex={props.disabled ? -1 : 0}
    >
      <div className={s.text}>{props.text}</div>
      {props.openInNewTab && <div className={s.openInNewTabIcon}><SVGIcon svg={openInNewTabIcon} /></div>}
      {!props.openInNewTab && <div className={s.linkArrow}>›</div>}
    </_Link>

  );
}

export default Link;
