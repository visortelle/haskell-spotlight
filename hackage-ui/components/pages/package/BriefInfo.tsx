import s from './BriefInfo.module.css';

export type BriefInfoProps = {
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
    </div>
  );
}

export default BriefInfo;
