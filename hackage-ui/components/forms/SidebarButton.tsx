import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import s from './SidebarButton.module.css';

export type SidebarButtonProps = {
  children: ReactNode,
  onClick: () => void,
  tabIndex?: number,
  href?: string,
  overrides?: ButtonHTMLAttributes<HTMLButtonElement> | AnchorHTMLAttributes<HTMLAnchorElement>
};

const SidebarButton = (props: SidebarButtonProps) => {
  return props.href ? (
    <a
      className={s.button}
      href={props.href}
      tabIndex={props.tabIndex}
      {...props.overrides as AnchorHTMLAttributes<HTMLAnchorElement>}
    >
      {props.children}
    </a>
  ) : (
    <button
      type="button"
      className={s.button}
      tabIndex={props.tabIndex}
      {...props.overrides as ButtonHTMLAttributes<HTMLButtonElement>}
    >
      {props.children}
    </button>
  );
}

export default SidebarButton;

