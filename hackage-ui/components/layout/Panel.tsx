import { ReactNode } from "react";
import s from './Panel.module.css';

const Panel = (props: { children: ReactNode }) => {
  return (
    <div className={s.panel}>
      {props.children}
    </div>
  );
}

export default Panel;
