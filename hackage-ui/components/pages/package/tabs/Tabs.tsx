import { PackageProps } from "../common";
import PackageOverview from "./PackageOverview";
import Versions from "./Versions";
import Dependencies from "./Dependencies";
import Docs from "./Docs";
import { ReactNode, useState } from "react";
import s from './Tabs.module.css';

type Tab = {
  id: string,
  name: string,
  render: () => ReactNode
};

const getTabs = (props: PackageProps): Tab[] => {
  return [
    {
      id: 'package-overview',
      name: 'Overview',
      render: () => <PackageOverview {...props} />
    },
    {
      id: 'docs',
      name: '📘 Docs',
      render: () => <Docs {...props} />
    },
    {
      id: 'versions',
      name: `${props.versions.available.length} Versions`,
      render: () => <Versions {...props} />
    },
    {
      id: 'dependencies',
      name: 'Dependencies',
      render: () => <Dependencies {...props} />
    }
  ]
}

const Tabs = (props: PackageProps) => {
  const [activeTab, setActiveTab] = useState('package-overview');
  const tabs = getTabs(props);

  return (
    <div className={s.tabs}>
      <div className={s.tabPicker}>
        {tabs.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <div key={tab.id} className={s.tabPickerItemContainer}>
              <div
                className={`${s.tabPickerItem} ${isActive ? s.tabPickerItemActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
              </div>
              {isActive && (<div className={s.tabPickerActiveItemBar}></div>)}
            </div>
          );
        })}
      </div>
      <div className={s.tabContent}>
        {tabs.find(tab => tab.id === activeTab)?.render()}
      </div>
    </div>
  );
}

export default Tabs;
