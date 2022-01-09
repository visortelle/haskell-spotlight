import s from './PackageOverview.module.css';
import { PackageProps } from "../common";

const PackageOverview = (props: PackageProps) => {
  return (
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
  );
}

export default PackageOverview;
