import s from './BigCard.module.css';
import SVGIcon from '../../../icons/SVGIcon';
import * as lib from '@haskell-spotlight/react-lib';
import { ReactNode } from 'react';
import Link, { LinkProps } from './Link';

export type BigCardProps = {
  iconFormat: 'svg' | 'png' | 'react',
  icon: string | ReactNode,
  title: string,
  description: string,
  link?: LinkProps,
  disabled?: boolean,
  secondaryContent?: ReactNode
}

const BigCard = (props: BigCardProps) => {
  let icon = null;
  if (props.iconFormat === 'svg') {
    icon = (<div className={s.svgIcon}><SVGIcon svg={props.icon as string} /></div>);
  } else if (props.iconFormat === 'react') {
    icon = props.icon
  }

  return (
    <div className={`${s.card} ${props.disabled ? s.cardDisabled : ''}`}>
      <div className="content">
        <div className={s.icon}>{icon}</div>
        <h3 className={s.title}>
          {props.title}
        </h3>
        <p className={s.description}>
          {props.description}
        </p>
        {props.link && <Link {...props.link} />}
      </div>
      {props.secondaryContent && (
        <div className={s.secondaryContent}>
          {props.secondaryContent}
        </div>
      )}
    </div>
  );
}

export const BigCardsRow = ({ children }: { children: ReactNode }) => {
  return (<div className={s.row}>{children}</div>);
}

export default BigCard;
