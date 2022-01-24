import s from './DependenciesPage.module.css';
import { PackageProps, Dependency } from './common';
import Layout from './Layout';
import * as lib from '@hackage-ui/react-lib';
import { memo } from 'react';

const screenName = 'PackageDependentsPage';

export type DependenciesPageProps = {
  package: PackageProps,
}

const DependentsPage = (props: DependenciesPageProps) => {
  return (
    <Layout
      analytics={{ screenName }}
      package={props.package}
      activeTab="dependencies"
    >
      <div className={s.dependentsPage}>
        <div className={s.info}>
          <span>Displaying
            {(props.package.dependencies?.dependenciesCount || 0) > 0 && <span>&nbsp;<strong>{props.package.dependencies?.dependenciesCount}</strong> dependencies</span>}
            {(props.package.dependencies?.conditionalDependenciesCount || 0) > 0 && <span>&nbsp;and <strong>{props.package.dependencies?.conditionalDependenciesCount}</strong> conditional dependencies </span>}
            <span>of <strong>{props.package.id}</strong></span>
          </span>
        </div>

        {props.package.dependencies?.modules.map(mod => {
          const conditionalDeps = mod.conditions.map((cond, i) => {
            if (cond.ifDeps.length === 0 && cond.elseDeps.length === 0) {
              return null;
            }

            return (
              <div key={i} className={s.conditionalDeps}>
                <div className={s.conditionalDepCode}>if {cond.predicate}</div>
                {(cond.ifDeps.length === 0 && cond.elseDeps.length !== 0) && (
                  <div style={{ padding: '12rem', margin: '-12rem 0', background: '#fff'}}>No dependencies found in this branch.</div>
                )}
                {cond.ifDeps.length !== 0 && (
                  <div>
                    {cond.ifDeps.map(dep => <Dependency key={dep.packageName} {...dep} />)}
                  </div>
                )}
                {cond.elseDeps.length !== 0 && (
                  <>
                    <div className={s.conditionalDepCode}>else</div>
                    <div>
                      {cond.elseDeps.map(dep => <Dependency key={dep.packageName} {...dep} />)}
                    </div>
                  </>
                )}
              </div>
            );
          });

          return (
            <div key={mod.name} className={s.module}>
              <div className={s.moduleName}>{mod.name}</div>
              <div>
                {mod.dependencies.map(dep => <Dependency key={dep.packageName} {...dep} />)}
              </div>

              {(mod.conditions.length > 0 && mod.conditions.some(m => (m.ifDeps.length > 0) || (m.elseDeps.length > 0))) &&
                <div className={s.conditionalDepsHeader}>Conditional dependencies of the <strong>{mod.name}</strong></div>
              }
              {conditionalDeps}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

const Dependency = (props: Dependency) => {
  return (
    <lib.links.A
      className={s.dependency}
      href={`/package/${props.packageName}/dependencies`}
      analytics={{ featureName: 'ClickPackageDependency', eventParams: { event_label: props.packageName, screen_name: screenName } }}
      prefetch={false}
    >
      <span
        style={{
          fontWeight: 'bold'
        }}
      >
        {props.packageName}
      </span>

      <span
        style={{
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
