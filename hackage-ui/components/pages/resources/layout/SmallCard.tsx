import s from './SmallCard.module.css';
import SVGIcon from '../../../icons/SVGIcon';
import openInNewTabIcon from '!!raw-loader!../../../icons/open-in-new-tab.svg';
import * as lib from '@hackage-ui/react-lib';
import { ReactNode } from 'react';
import Link, { LinkProps } from './Link';

export type SmallCardProps = {
  iconFormat: 'svg' | 'png' | 'react',
  icon: string | ReactNode,
  title: string,
  description: string,
  link?: LinkProps,
  disabled?: boolean
}

const SmallCard = (props: SmallCardProps) => {
  let icon = null;
  if (props.iconFormat === 'svg') {
    icon = (<div className={s.svgIcon}><SVGIcon svg={props.icon as string} /></div>);
  } else if (props.iconFormat === 'react') {
    icon = props.icon
  }

  return (
    <div className={`${s.card} ${props.disabled ? s.cardDisabled : ''}`}>
      <div className={s.icon}>{icon}</div>
      <h3 className={s.title}>
        {props.title}
      </h3>
      <p className={s.description}>
        {props.description}
      </p>
      {props.link && <Link {...props.link} />}
    </div>
  );
}

export const SmallCardsRow = ({ children }: { children: ReactNode }) => {
  return (<div className={s.row}>{children}</div>);
}

export default SmallCard;
