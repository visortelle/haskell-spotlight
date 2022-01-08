import s from './PackageList.module.css';
import ArrowRightIcon from '!!raw-loader!../../components/icons/arrow-right.svg';
import SvgIcon from '../icons/SVGIcon';
import A from '../layout/A';

export type Package = {
  name: string,
  version?: string
}

export type Props = {
  pkgs: 'loading' | Package[],
  getHref: (pkg: Package) => string,
  count: number,
  analytics: { screenName: string }
}

const PackageList = (props: Props) => {
  return (
    <div className={s.packageList}>
      {props.pkgs === 'loading' && (
        Array.from(Array(props.count)).map((_, i) => <div key={i} className={`${s.loading} loading-overlay`}></div>)
      )}
      {props.pkgs !== 'loading' && props.pkgs.length === 0 && (
        <div className={`${s.nothingToShow}`}><span>Nothing to show</span></div>
      )}
      {props.pkgs !== 'loading' && props.pkgs.length > 0 && props.pkgs.map((pkg) => {
        return (
          <A
            key={`${pkg.name}@${pkg.version || 'unknown-version'}`}
            className={s.package}
            href={props.getHref(pkg)}
            analytics={{ featureName: 'PackageListItem', eventParams: { screen_name: props.analytics.screenName } }}
          >
            <div className={s.packageInfo}>
              <div className={s.packageName}>{pkg.name}</div>
              {pkg.version && (
                <div className={s.packageVersion}>{pkg.version}</div>
              )}
            </div>
            <div className={s.openPackageIcon}>
              <SvgIcon svg={ArrowRightIcon} />
            </div>
          </A>
        );
      })}
    </div>
  );
}

export default PackageList;
