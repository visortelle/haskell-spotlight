import s from './Docs.module.css';
import { PackageProps } from '../common';

const Docs = (props: PackageProps) => {
  return (
    <div className={s.dependents}>
      Dependents
    </div>
  );
}

export default Docs;
