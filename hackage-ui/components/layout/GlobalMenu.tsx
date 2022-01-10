import { useEffect, useState, useContext } from 'react';
import s from './GlobalMenu.module.css';
import Logo from '../branding/Logo';
import * as lib from '@hackage-ui/react-lib';
import { SettingsButton } from '../forms/Settings';
import { useRouter } from 'next/router';

const heightPx = 60;

type Props = {
  items: Array<{
    id: string,
    title: string,
    href: string
  }>
};

export const defaultMenuProps: Props = {
  items: [
    { id: 'propose-an-idea', href: 'https://github.com/visortelle/hackage-ui/issues/1', title: 'Propose an idea' },
  ]
};

const GlobalMenu = (props: Props) => {
  const router = useRouter();
  const [atTop, setAtTop] = useState(false);
  const appContext = useContext(lib.appContext.AppContext);

  function handleScroll(): void {
    let scrollY = window.scrollY;
    if (scrollY > 4) {
      setAtTop(true);
      return;
    }

    setAtTop(false);
  }

  useEffect(() => {
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        // Fix margin top for elements below menu.
        style={{ height: `${heightPx}rem` }}
      ></div>
      <div
        className={`${s.menu} ${atTop ? s.menuAtTop : ''}`}
        style={{ height: `${heightPx}rem` }}
      >
        <div className={`${s.progressIndicator} ${Object.keys(appContext.tasks).length > 0 ? s.progressIndicatorRunning : ''}`}></div>
        <div className={s.content}>
          <lib.links.A href="/" className={s.logo} analytics={{ featureName: 'GlobalMenuLogo', eventParams: { screen_name: 'All' } }}>
            <Logo fontSize={18} />
          </lib.links.A>

          <div className={s.searchInput}>
            <lib.searchInput.SearchInput
              key={
                // Refresh search input state on each location change
                (global as any)?.document ? (document.location.origin + document.location.pathname) : '_'
              }
              router={router}
            />
          </div>

          {false && <SettingsButton />}
          <ul className={s.menuItems}>
            {props.items.map(item => {
              return (
                <li key={item.id} className={s.menuItem}>
                  <lib.links.A className={s.menuItemLink} href={item.href} analytics={{ featureName: `GlobalMenuItem`, eventParams: { screen_name: 'All' } }}>{item.title}</lib.links.A>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default GlobalMenu;
