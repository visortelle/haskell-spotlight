import { useState, useEffect } from "react";
import GlobalMenu, { defaultMenuProps } from "../layout/GlobalMenu";
import SidebarButton from "../forms/SidebarButton";
import Footer from "../layout/Footer";
import s from './Package.module.css';
import SvgIcon from "../icons/SVGIcon";
import CopyButton from "../forms/CopyButton";
import { format as formatTimeAgo } from 'timeago.js';
import ReactTooltip from 'react-tooltip';
import licenseIcon from '!!raw-loader!../icons/license.svg';
import homepageIcon from '!!raw-loader!../icons/link.svg';
import repositoryIcon from '!!raw-loader!../icons/github.svg';
import bugReportIcon from '!!raw-loader!../icons/bug-report.svg';
import updatedAtIcon from '!!raw-loader!../icons/updated-at.svg';

export type Versions = {
  current: string,
  available: string[],
}

export type License = {
  name: string,
  url: string | null
}

export type Homepage = {
  text: string,
  url: string
}

export type PackageProps = {
  id: string,
  name: string,
  license: License | null,
  homepage: Homepage | null,
  repositoryUrl: string | null,
  bugReportsUrl: string | null,
  versions: Versions,
  shortDescription: string | null,
  longDescriptionHtml: string | null,
  // Date in ISO 8601
  updatedAt: string | null
}

const tooltipId = 'package-tooltip';

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
  const repository = props.package.repositoryUrl ? parseRepositoryUrl(props.package.repositoryUrl) : null;
  const copyToInstall = `${props.package.name} >= ${props.package.versions.current}`;

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
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
              <a style={{ color: 'inherit' }} href={props.package.license.url}>{props.package.license.name}</a>
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
          <CopyButton copyText={copyToInstall} displayText={copyToInstall} />
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
            <a className={s.sidebarEntryLink} href={props.package.homepage.url}>
              {props.package.homepage.text.replace(/^https?\:\/\//, '').replace(/\/$/, '')}
            </a>
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
                <CopyButton copyText={repository.gitUrl} displayText={repository.gitUrl} />
              </div>
            )}

            {repository.browserUrl && repository.kind === 'unknown' && (
              <div className={s.sidebarEntry}>
                <a href={repository.browserUrl}>{repository.displayText}</a>
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
    const [owner, repo] = url.replace(/^git@github\.com\/?/, '').replace(/\/$/, '').replace(/\.git$/, '').split('/');
    console.log('REPO', owner, repo);
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

export default Package;
