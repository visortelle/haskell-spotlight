import s from './VersionsPage.module.css';
import { PackageProps, Versions } from './common';
import Layout from './Layout';
import * as lib from '@hackage-ui/react-lib';

const screenName = 'PackageVersionsPage';

export type VersionsPageProps = {
  package: PackageProps,
}

const VersionsPage = (props: VersionsPageProps) => {
  const versions = props.package.versions ? Array.from(new Set([
    ...props.package.versions?.normal,
    ...props.package.versions?.unpreferred,
    ...props.package.versions?.deprecated,
  ])) : [];

  return (
    <Layout analytics={{ screenName }} package={props.package} activeTab="versions">
      <div className={s.versionsPage}>
        <div className={s.info}>All {versions.length} versions of <strong>{props.package.name}</strong></div>
        <div>
          {versions.map(versionId => {
            let kind: VersionKind = 'normal';
            if (props.package.versions && props.package.versions?.unpreferred.includes(versionId)) {
              kind = 'unpreffered'
            } else if (props.package.versions && props.package.versions?.deprecated.includes(versionId)) {
              kind = 'deprecated'
            }

            return (
              <Version
                key={versionId}
                id={versionId}
                kind={kind}
              />
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

type VersionKind = 'normal' | 'unpreffered' | 'deprecated';
export type VersionProps = {
  id: string,
  kind: VersionKind
}

const Version = (props: VersionProps) => {
  return (
    <div className={s.version}>
      <div className={s.versionKind}>

      </div>
      <div className={s.versionId}>{props.id}</div>
    </div>
  );
}

export default VersionsPage;
