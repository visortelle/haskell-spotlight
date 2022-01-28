import { ReactNode } from "react";
import s from './Tabs.module.css';
import * as lib from '@haskell-spotlight/react-lib';

export type Tab = {
  id: string,
  title: string,
  href: string,
};

export type TabsProps = {
  tabs: Tab[],
  activeTab: string,
}

const Tabs = (props: TabsProps) => {
  return (
    <div className={s.tabs}>
      <div className={s.tabPicker}>
        {props.tabs.map(tab => {
          const isActive = tab.id === props.activeTab;
          return (
            <div key={tab.id} className={s.tabPickerItemContainer}>
              <lib.links.A
                className={`${s.tabPickerItem} ${isActive ? s.tabPickerItemActive : ''}`}
                href={tab.href}
                analytics={{ featureName: `ClickTab-${tab.id}`, eventParams: {} }}
              >
                {tab.title}
              </lib.links.A>
            </div >
          );
        })}
      </div >
    </div >
  );
}

export default Tabs;
