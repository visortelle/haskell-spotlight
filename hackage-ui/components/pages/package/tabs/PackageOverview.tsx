import s from './PackageOverview.module.css';
import { PackageProps } from "../common";

const PackageOverview = (props: PackageProps) => {
  return (
    <div className={s.package}>
      <div className={s.content}>
        {props.longDescriptionHtml && <div className={s.longDescription} dangerouslySetInnerHTML={{ __html: props.longDescriptionHtml }}></div>}
      </div>
    </div>
  );
}

export default PackageOverview;
