import { useEffect, useState } from 'react';
import s from './GlobalMenu.module.css';
import Logo from '../branding/Logo';
import Input from '../forms/Input';

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
  let [atTop, setAtTop] = useState(false);

  function handleScroll(): void {
    let scrollY = window.scrollY;
    if (scrollY > heightPx) {
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
        <div className={s.content}>
          <a className={s.logo} href="#">
            <Logo fontSize={18} />
          </a>

          <div className={s.searchInput}>
            <Input onChange={() => { }} placeholder='Click to search...' value='' />
          </div>

          <ul className={s.menuItems}>
            {props.items.map(item => {
              return (
                <li key={item.id} className={s.menuItem}>
                  <a className={s.menuItemLink} href={item.href}>{item.title}</a>
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
