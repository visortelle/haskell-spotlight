import s from './DependentsPage.module.css';
import { PackageProps, ReverseDependency } from './common';
import Layout from './Layout';
import * as lib from '@hackage-ui/react-lib';
import { useState, memo } from 'react';

const screenName = 'PackageDependentsPage';

export type DependenciesPageProps = {
  package: PackageProps,
}

const DependentsPage = (props: DependenciesPageProps) => {
  const [showOutdatedOnly, setShowOutdatedOnly] = useState(false);

  const _deps = props.package.reverseDependencies || [];
  const deps = showOutdatedOnly ? _deps.filter(dep => dep.isOutdated) : _deps;

  return (
    <Layout
      analytics={{ screenName }}
      package={props.package}
      activeTab="dependencies"
      hidePackageVersion={true}
    >
      <div className={s.dependentsPage}>
        <div className={s.info}>
          <span>Displaying {deps.length} reverse dependencies of <strong>{props.package.name}</strong></span>
          <lib.headerButton
            onClick={() => setShowOutdatedOnly(!showOutdatedOnly)}
            text={showOutdatedOnly ? 'Show All' : 'Show Outdated Only'}
          />
        </div>

        <div>
          {deps.map(dep => {
            return (
              <Dependency key={dep.packageName} {...dep} />
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

const Dependency = (props: ReverseDependency) => {
  return (
    <lib.links.A
      className={s.dependent}
      href={`/package/${props.packageName}/dependencies`}
      analytics={{ featureName: 'ClickPackageDependency', eventParams: { event_label: props.packageName, screen_name: screenName } }}
      prefetch={false}
    >
      <div
        className={s.label}
        style={{
          background: props.isOutdated ? 'var(--accent-color-red)' : 'var(--purple-color-2)'
        }}
      >
        {props.isOutdated ? 'Outdated' : 'OK'}
      </div>

      <span
        style={{
          color: props.isOutdated ? 'var(--accent-color-red)' : 'var(--purple-color-2)',
          fontWeight: 'bold'
        }}
      >
        {props.packageName}
      </span>

      <span
        style={{
          color: props.isOutdated ? 'var(--accent-color-red)' : 'var(--purple-color-2)',
          marginLeft: 'auto',
          fontWeight: 'bold'
        }}
      >
        {props.versionsRange}
      </span>
    </lib.links.A>
  );
}

export default memo(DependentsPage);
