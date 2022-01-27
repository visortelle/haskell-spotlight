import GlobalMenu, { defaultMenuProps } from "../../../layout/GlobalMenu";
import Footer from "../../../layout/Footer";
import s from './Layout.module.css';
import { ReactNode } from 'react';

type LayoutProps = {
  analytics: {
    screenName: string
  },
  children: ReactNode,
}

const Layout = (props: LayoutProps) => {
  return (
    <div className={s.page}>
      <GlobalMenu {...defaultMenuProps} />
      <div className={s.contentContainer}>
        <div className={s.content}>
          <div className={s.children}>
            {props.children}
          </div>
        </div>
      </div>
      <div className={s.footer}>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;

