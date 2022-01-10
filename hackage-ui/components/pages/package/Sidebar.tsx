import { useState, useEffect, useContext } from "react";
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
import { PackageProps } from './common';
import * as lib from '@hackage-ui/react-lib';

const tooltipId = 'package-sidebar-tooltip';

type SidebarProps = {
  package: PackageProps,
  analytics: { screenName: string }
}

export const Sidebar = (props: SidebarProps) => {
  const appContext = useContext(lib.appContext.AppContext);
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
              <lib.links.ExtA style={{ color: 'inherit' }} href={props.package.license.url} analytics={{ featureName: 'PackageLicenseLink', eventParams: { screen_name: props.analytics.screenName } }}>
                {props.package.license.name}
              </lib.links.ExtA>
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
            <lib.links.ExtA
              className={s.sidebarEntryLink}
              href={props.package.homepage.url}
              analytics={{ featureName: 'GoToPackageHomepage', eventParams: { screen_name: props.analytics.screenName } }}
            >
              {props.package.homepage.text.replace(/^https?\:\/\//, '').replace(/\/$/, '')}
            </lib.links.ExtA>
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
                <lib.links.ExtA
                  href={repository.browserUrl}
                  analytics={{ featureName: 'GoToPackageRepository', eventParams: { screen_name: props.analytics.screenName } }}
                >
                  {repository.displayText}
                </lib.links.ExtA>
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

type Repository = {
  kind: 'unknown' | 'github',
  displayText: string,
  browserUrl: string,
  gitUrl: string | null
}

// TODO - add tests, GitLab, BitBucket, others.
function parseRepositoryUrl(url: string): Repository {

  // GitHub
  function gitHub(owner: string, repo: string): Repository {
    return {
      kind: 'github',
      displayText: `${owner}/${repo}`,
      browserUrl: `https://github.com/${owner}/${repo}`,
      gitUrl: `git@github.com:${owner}/${repo}.git`
    }
  }

  if (url.match(/^git@github.com:.*$/g)) {
    const [owner, repo] = url.replace(/^git@github\.com:\/?/, '').replace(/\/$/, '').replace(/\.git$/, '').split('/');
    return gitHub(owner, repo);

  } else if (url.match(/^(https?|git)\:\/\/github.com\/.*$/g)) {
    const [owner, repo] = url.replace(/^(https?|git)\:\/\/github\.com\/?/, '').replace(/\/$/, '').replace(/\.git$/, '').split('/');
    return gitHub(owner, repo);

  }

  // Unknown
  return {
    kind: 'unknown',
    displayText: url,
    browserUrl: url,
    gitUrl: url.match(/git\:\/\//) ? url : null
  }
}

export default Sidebar;
