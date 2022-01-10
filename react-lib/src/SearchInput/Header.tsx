import React, { ReactNode } from 'react';
import s from './Header.module.css';

type HeaderProps = {
  children: ReactNode
}

const Header = (props: HeaderProps) => {
  return <div className={s.header}>{props.children}</div>
}

export default Header;
