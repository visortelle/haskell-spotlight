import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, useContext } from 'react';
import s from './Button.module.css';
import { ExtA } from '../layout/A';
import AppContext from '../AppContext';

export type ButtonProps = {
  children: ReactNode,
  type: 'regularButton' | 'promoButton',
  onClick: () => void,
  kind?: 'regular' | 'danger',
  tabIndex?: number,
  href?: string,
  overrides?: ButtonHTMLAttributes<HTMLButtonElement> | AnchorHTMLAttributes<HTMLAnchorElement>,
} & { analytics: { featureName: string, eventParams: Gtag.EventParams } };

const Button = (props: ButtonProps) => {
  const appContext = useContext(AppContext);

  return props.href ? (
    <ExtA
      className={`${s[props.type]} ${props.kind === 'danger' ? s.danger : ''}`}
      href={props.href}
      tabIndex={props.tabIndex}
      analytics={props.analytics}
      {...props.overrides as AnchorHTMLAttributes<HTMLAnchorElement>}
    >
      {props.children}
    </ExtA>
  ) : (
    <button
      type="button"
      className={`${s[props.type]} ${props.kind === 'danger' ? s.danger : ''}`}
      tabIndex={props.tabIndex}
      onClick={() => {
        props.onClick();
        appContext?.analytics?.gtag('event', `ButtonClicked-${props.analytics.featureName}`, {
          ...props.analytics.eventParams
        });
      }}
      {...props.overrides as ButtonHTMLAttributes<HTMLButtonElement>}
    >
      {props.children}
    </button>
  );
}

export default Button;
