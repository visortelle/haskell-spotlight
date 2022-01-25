import s from './DependentsPage.module.css';
import { PackageProps, ReverseDependency } from './common';
import Layout from './Layout';
import * as lib from '@hackage-ui/react-lib';
import { useState, memo } from 'react';
import SmallButton from './SmallButton';

const screenName = 'PackageDependentsPage';

export type DependentsPageProps = {
  package: PackageProps,
}

const perfSafeMaxCount = 1000;

const DependentsPage = (props: DependentsPageProps) => {
  const [showOutdatedOnly, setShowOutdatedOnly] = useState(false);

  const _deps = props.package.reverseDependencies || [];
  const deps = showOutdatedOnly ? _deps.filter(dep => dep.isOutdated) : _deps;

  return (
    <Layout
      analytics={{ screenName }}
      package={props.package}
      activeTab="dependents"
      hidePackageVersion={true}
    >
      <div className={s.dependentsPage}>
        <div className={s.info}>
          <span>Displaying <strong>{deps.length}</strong> of <strong>{props.package.reverseDependencies?.length || '0'}</strong> reverse dependencies of <strong>{props.package.name}</strong></span>
          <SmallButton
            onClick={() => setShowOutdatedOnly(!showOutdatedOnly)}
            text={showOutdatedOnly ? 'Show All' : 'Show Outdated Only'}
          />
        </div>

        {(deps?.length || 0) > perfSafeMaxCount && (
          <div className={s.perfDisclaimer}>🚧 Amount of items to display is more than {perfSafeMaxCount}. Page may become unresponsive. 🚧</div>
        )}

        <div>
          {deps.map(dep => {
            return (
              <Dependent key={dep.packageName} {...dep} />
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

const Dependent = (props: ReverseDependency) => {
  return (
    <lib.links.A
      className={s.dependent}
      href={`/package/${props.packageName}/dependents`}
      analytics={{ featureName: 'ClickPackageReverseDependency', eventParams: { event_label: props.packageName, screen_name: screenName } }}
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
          fontFamily: 'Fira Code'
        }}
      >
        {props.versionsRange}
      </span>
    </lib.links.A>
  );
}

export default memo(DependentsPage);
