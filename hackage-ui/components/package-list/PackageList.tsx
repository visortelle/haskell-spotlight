import s from './PackageList.module.css';
import ArrowRightIcon from '!!raw-loader!../../components/icons/arrow-right.svg';
import SvgIcon from '../icons/SVGIcon';

export type Package = {
  name: string,
  version?: string
}

export type Props = {
  pkgs: Package[],
  getHref: (pkg: Package) => string
}

const PackageList = (props: Props) => {
  return (
    <div className={s.packageList}>
      {props.pkgs.map((pkg) => {
        return (
          <a key={`${pkg.name}@${pkg.version || 'unknown-version'}`} className={s.package} href={props.getHref(pkg)}>
            <div className={s.packageInfo}>
              <div className={s.packageName}>{pkg.name}</div>
              {pkg.version && (
                <div className={s.packageVersion}>{pkg.version}</div>
              )}
            </div>
            <div className={s.openPackageIcon}>
                <SvgIcon svg={ArrowRightIcon}/>
            </div>
          </a>
        );
      })}
    </div>
  );
}

export default PackageList;
