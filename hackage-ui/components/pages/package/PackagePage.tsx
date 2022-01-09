import GlobalMenu, { defaultMenuProps } from "../../layout/GlobalMenu";
import Footer from "../../layout/Footer";
import s from './PackagePage.module.css';
import { PackageProps } from "./common";
import Sidebar from './Sidebar';
import PackageOverview from "./tabs/PackageOverview";

const screenName = 'HackagePackagePage';

const Package = (props: PackageProps) => {
  return (
    <div className={s.page}>
      <GlobalMenu {...defaultMenuProps} />
      <div className={s.packageContainer}>
        <Tabs {...props} />
        <div className={s.sidebarContainer}>
          <Sidebar package={props} analytics={{ screenName }} />
        </div>
      </div>
      <div className={s.footer}>
        <Footer />
      </div>
    </div>
  );
}

const Tabs = (props: PackageProps) => {
  return (
    <PackageOverview {...props} />
  );
}

export default Package;
