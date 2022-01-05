import { useContext } from "react";
import AppContext from "../AppContext";
import GlobalMenu, { defaultMenuProps } from "../layout/GlobalMenu";
import Footer from "../layout/Footer";
import s from './Package.module.css';
import SvgIcon from "../icons/SVGIcon";
import licenseIcon from '!!raw-loader!../icons/license.svg';
import contentCopyIcon from '!!raw-loader!../icons/content-copy.svg';

export type Versions = {
  current: string,
  available: string[],
}

export type License = {
  name: string,
  url?: string
}

export type PackageProps = {
  id: string,
  name: string,
  license?: License,
  homepage?: string,
  versions: Versions,
  shortDescription?: string,
  longDescriptionHtml?: string
}

const Package = (props: PackageProps) => {
  return (
    <div className={s.page}>
      <GlobalMenu {...defaultMenuProps} />
      <div className={s.packageContainer}>
        <div className={s.package}>
          <div className={s.content}>
            <div className={s.briefInfo}>
              <div className={s.packageName}>
                <small>📦</small>&nbsp;<h1 className={s.packageNameH1}>{props.name}</h1><span className={s.packageVersion}>{props.versions.current}</span>
              </div>
              {props.shortDescription && <div className={s.shortDescription}>{props.shortDescription}</div>}
              {props.longDescriptionHtml && <div className={s.longDescription} dangerouslySetInnerHTML={{ __html: props.longDescriptionHtml }}></div>}
            </div>
          </div>
        </div>
        <div className={s.sidebarContainer}>
          <Sidebar package={props} />
        </div>
      </div>
      <div className={s.footer}>
        <Footer />
      </div>
    </div>
  );
}

type SidebarProps = {
  package: PackageProps
}
const Sidebar = (props: SidebarProps) => {
  const appContex = useContext(AppContext);

  return (
    <div className={s.sidebar}>
      <div className={s.sidebarSection}>
        <h3 className={s.sidebarSectionHeader}>Metadata</h3>
        {props.package.license && <div className={s.sidebarEntry} title="License">
          <div className={s.sidebarEntryIcon}><SvgIcon svg={licenseIcon} /></div>
          {props.package.license?.url ? (
            <a href={props.package.license.url}>{props.package.license.name}</a>
          ) : (
            <span>{props.package.license.name}</span>
          )}
        </div>}
      </div>

      <div className={s.sidebarSection}>
        <h3 className={s.sidebarSectionHeader}>Install</h3>
        <div className={`${s.sidebarEntry} ${s.sidebarInstall}`}>
          <small>Add this to your *.cabal file:</small>
          <div
            className={s.sidebarInstallCopy}
            onClick={() => {
              navigator.clipboard.writeText(`${props.package.name} >= ${props.package.versions.current}`);
              appContex.notifySuccess('Copied to clipboard!');
            }}
          >
            <code className={s.sidebarInstallCopyText}>{props.package.name} &gt;= {props.package.versions.current}</code>
            <div className={s.sidebarInstallCopyIcon}>
              <SvgIcon svg={contentCopyIcon} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// Left sidebar:
// Tabs:
// readme - https://hackage.haskell.org/api#package-contents /package/:package/readme,
// changelog - https://hackage.haskell.org/api#package-contents /package/:package/changelog,
// versions, - versions list + info from this page if exists.
// dependencies,
// dependents
// This PR should make it easier: https://github.com/haskell/hackage-server/pull/996

export default Package;
