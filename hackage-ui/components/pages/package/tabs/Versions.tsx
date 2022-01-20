import s from './Versions.module.css';
import { PackageProps } from '../common';

const Versions = (props: PackageProps) => {
  return (
    <div className={s.versions}>
      <div>All {props.versions.available.length} versions of {props.name} since</div>
      <div>
        {props.versions.available.map(version => {
          return (
            <div key={version.id}>
              <div>{version.id}</div>
              <div>{version.license.name}</div>
              <div>{version.releasedAt}</div>
              <div>{version.releasedBy}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Versions;
