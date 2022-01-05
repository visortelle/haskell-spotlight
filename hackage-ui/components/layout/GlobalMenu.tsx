import { useEffect, useState, useContext } from 'react';
import s from './GlobalMenu.module.css';
import Logo from '../branding/Logo';
import SearchInput from './SearchInput';
import AppContext from '../AppContext';
import A from './A';

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
    { id: 'browse-all-packages', href: '#browser-all-packages', title: 'Browse All Packages' },
  ]
};

const GlobalMenu = (props: Props) => {
  const [atTop, setAtTop] = useState(false);
  const appContext = useContext(AppContext);

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
          <A href="/" className={s.logo}>
            <Logo fontSize={18} />
          </A>

          <div className={s.searchInput}>
            <SearchInput
              key={
                // Refresh search input state on each location change
                (global as any)?.document ? (document.location.origin + document.location.pathname) : '_'
              }
            />
          </div>

          <ul className={s.menuItems}>
            {props.items.map(item => {
              return (
                <li key={item.id} className={s.menuItem}>
                  <A className={s.menuItemLink} href={item.href}>{item.title}</A>
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
