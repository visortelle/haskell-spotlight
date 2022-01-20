import GlobalMenu, { defaultMenuProps } from "../../layout/GlobalMenu";
import Footer from "../../layout/Footer";
import s from './PackagePage.module.css';
import { PackageProps } from "./common";
import Sidebar from './Sidebar';
import Tabs from "./tabs/Tabs";

const screenName = 'HackagePackagePage';

const Package = (props: PackageProps) => {
  return (
    <div className={s.page}>
      <GlobalMenu {...defaultMenuProps} />
      <div className={s.packageContainer}>

        <div className={s.content}>
          <div className={s.briefInfo}>
            <div className={s.packageName}>
              <small style={{ position: 'relative', top: '2rem' }}>📦</small>&nbsp;<h1 className={s.packageNameH1}>{props.name}</h1><span className={s.packageVersion}>{props.versions.current}</span>
            </div>
            {props.shortDescription && <div className={s.shortDescription}>{props.shortDescription}</div>}
          </div>

          <Tabs {...props} />
        </div>

        <div className={s.sidebar}>
          <Sidebar package={props} analytics={{ screenName }} />
        </div>
      </div>
      <div className={s.footer}>
        <Footer />
      </div>
    </div>
  );
}

export default Package;
