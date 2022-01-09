import GlobalMenu, { defaultMenuProps } from "../../layout/GlobalMenu";
import Footer from "../../layout/Footer";
import s from './Package.module.css';
import { PackageProps } from "./common";
import Sidebar from './Sidebar';

const screenName = 'HackagePackagePage';

const Package = (props: PackageProps) => {
  return (
    <div className={s.page}>
      <GlobalMenu {...defaultMenuProps} />
      <div className={s.packageContainer}>
        <div className={s.package}>
          <div className={s.content}>
            <div className={s.briefInfo}>
              <div className={s.packageName}>
                <small style={{ position: 'relative', top: '2rem' }}>📦</small>&nbsp;<h1 className={s.packageNameH1}>{props.name}</h1><span className={s.packageVersion}>{props.versions.current}</span>
              </div>
              {props.shortDescription && <div className={s.shortDescription}>{props.shortDescription}</div>}
              {props.longDescriptionHtml && <div className={s.longDescription} dangerouslySetInnerHTML={{ __html: props.longDescriptionHtml }}></div>}
            </div>
          </div>
        </div>
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
export default Package;
