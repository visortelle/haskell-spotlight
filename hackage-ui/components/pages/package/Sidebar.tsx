import { useState, useEffect, useContext } from "react";
import AppContext from "../../AppContext";
import s from './Sidebar.module.css';
import SvgIcon from "../../icons/SVGIcon";
import CopyButton from "../../forms/CopyButton";
import { format as formatTimeAgo } from 'timeago.js';
import ReactTooltip from 'react-tooltip';
import licenseIcon from '!!raw-loader!../../icons/license.svg';
import homepageIcon from '!!raw-loader!../../icons/link.svg';
import repositoryIcon from '!!raw-loader!../../icons/github.svg';
import bugReportIcon from '!!raw-loader!../../icons/bug-report.svg';
import updatedAtIcon from '!!raw-loader!../../icons/updated-at.svg';
import SidebarButton from "../../forms/SidebarButton";
import { ExtA } from "../../layout/A";
import { PackageProps } from './common';
import { Repository, parseRepositoryUrl } from '../../api/Github';

const tooltipId = 'package-sidebar-tooltip';

type SidebarProps = {
  package: PackageProps,
  analytics: { screenName: string }
}

export const Sidebar = (props: SidebarProps) => {
  const appContext = useContext(AppContext);
  const repository = props.package.repositoryUrl ? parseRepositoryUrl(props.package.repositoryUrl) : null;
  const copyToInstall = `${props.package.name} >= ${props.package.versions.current}`;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    appContext.analytics?.gtag('event', 'screen_view', { screen_name: props.analytics.screenName });
    appContext.analytics?.gtag('event', 'view_item', { items: [{ id: props.package.id, name: props.package.name, category: 'hackage_package' }] });
    setIsMounted(true);
  }, []);

  return (
    <div className={s.sidebar}>
      {isMounted && <ReactTooltip id={tooltipId} />}

      <div className={s.sidebarSection}>
        <h3 className={s.sidebarSectionHeader}>Metadata</h3>
        {props.package.updatedAt && (
          <div
            className={`${s.sidebarEntry} ${s.sidebarEntryShrink}`}
            data-tip={`Last publish: ${new Date(Date.parse(props.package.updatedAt)).toLocaleString('en-us', { day: 'numeric', month: 'long', year: 'numeric' })}`}
            data-for={tooltipId}
          >
            <div className={s.sidebarEntryIcon}><SvgIcon svg={updatedAtIcon} /></div>
            {formatTimeAgo(props.package.updatedAt)}
          </div>
        )}
        {props.package.license && (
          <div
            className={`${s.sidebarEntry} ${s.sidebarEntryShrink}`}
            data-tip="License"
            data-for={tooltipId}
          >
            <div className={s.sidebarEntryIcon}><SvgIcon svg={licenseIcon} /></div>
            {props.package.license?.url ? (
              <ExtA style={{ color: 'inherit' }} href={props.package.license.url} analytics={{ featureName: 'PackageLicenseLink', eventParams: { screen_name: props.analytics.screenName } }}>
                {props.package.license.name}
              </ExtA>
            ) : (
              <span>{props.package.license.name}</span>
            )}
          </div>
        )}
      </div>

      <div className={s.sidebarSection}>
        <h3 className={s.sidebarSectionHeader}>Install</h3>
        <div className={`${s.sidebarEntry} ${s.sidebarInstall}`}>
          <small>Add this to your *.cabal file:</small>
          <CopyButton copyText={copyToInstall} displayText={copyToInstall} analyticsId="CopyToInstall" />
        </div>
      </div>

      {
        props.package.homepage &&
        <div className={s.sidebarSection}>
          <h3 className={s.sidebarSectionHeader}>
            Homepage
          </h3>
          <div className={s.sidebarEntry}>
            <div className={s.sidebarEntryIcon}><SvgIcon svg={homepageIcon} /></div>
            <ExtA
              className={s.sidebarEntryLink}
              href={props.package.homepage.url}
              analytics={{ featureName: 'GoToPackageHomepage', eventParams: { screen_name: props.analytics.screenName } }}
            >
              {props.package.homepage.text.replace(/^https?\:\/\//, '').replace(/\/$/, '')}
            </ExtA>
          </div>
        </div>
      }

      {repository && (
        <div className={s.sidebarSection}>
          <h3 className={s.sidebarSectionHeader}>
            <div>Repository</div>
          </h3>
          <div className={s.repositoryContent}>

            {repository.gitUrl && (
              <div className={s.sidebarEntry}>
                <CopyButton copyText={repository.gitUrl} displayText={repository.gitUrl} analyticsId="CopyGitRepository" />
              </div>
            )}

            {repository.browserUrl && repository.kind === 'unknown' && (
              <div className={s.sidebarEntry}>
                <ExtA
                  href={repository.browserUrl}
                  analytics={{ featureName: 'GoToPackageRepository', eventParams: { screen_name: props.analytics.screenName } }}
                >
                  {repository.displayText}
                </ExtA>
              </div>
            )}

            {repository.kind === 'github' && (
              <div className={s.sidebarEntry}>
                <SidebarButton
                  onClick={() => { }}
                  href={repository.browserUrl}
                  overrides={{ style: { backgroundColor: 'var(--text-color)' } }}
                >
                  <div>Browse on GitHub</div>
                  <div className={s.sidebarGitHubButtonIcon}><SvgIcon svg={repositoryIcon} /></div>
                </SidebarButton>
              </div>
            )}

            {props.package.bugReportsUrl && (
              <div className={s.sidebarEntry}>
                <SidebarButton
                  onClick={() => { }}
                  href={props.package.bugReportsUrl}
                  overrides={{ style: { backgroundColor: 'var(--accent-color-red)' } }}
                >
                  <div>Report a Bug</div>
                  <div className={s.sidebarBugReportIcon}><SvgIcon svg={bugReportIcon} /></div>
                </SidebarButton>
              </div>
            )}

          </div>
        </div>
      )}
    </div >
  );
}

export default Sidebar;
