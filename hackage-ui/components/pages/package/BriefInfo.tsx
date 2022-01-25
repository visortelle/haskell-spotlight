import s from './BriefInfo.module.css';
import * as lib from '@hackage-ui/react-lib';
import SVGIcon from '../../icons/SVGIcon';
import openInNewTabIcon from '!!raw-loader!../../icons/open-in-new-tab.svg';

export type BriefInfoProps = {
  packageId: string | null,
  packageName: string | null,
  packageVersion: string | null,
  shortDescription: string | null,
  hidePackageVersion?: boolean
}

const BriefInfo = (props: BriefInfoProps) => {
  return (
    <div className={s.briefInfo}>
      <div className={s.packageName}>
        <small style={{ position: 'relative', top: '2rem' }}>📦</small>&nbsp;
        {props.packageName && <h1 className={s.packageNameH1}>{props.packageName}</h1>}
        {props.packageVersion && !props.hidePackageVersion && <span className={s.packageVersion}>{props.packageVersion}</span>}
      </div>
      {props.shortDescription && <div className={s.shortDescription}>{props.shortDescription}</div>}

      {props.packageId &&
        <lib.links.ExtA className={s.openOnHackage} target='__blank' href={`https://hackage.haskell.org/package/${props.packageId}`} analytics={{ featureName: 'showOnPackage', eventParams: {} }}>
          <SVGIcon svg={openInNewTabIcon} />View on Hackage
        </lib.links.ExtA>
      }
    </div>
  );
}

export default BriefInfo;
