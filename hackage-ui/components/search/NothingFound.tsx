import { ReactNode, useState, useEffect, useContext } from 'react'
import s from './NothingFound.module.css'
import AppContext from '../AppContext';

type NothingFoundProps = {
  children: ReactNode,
  waitBeforeShow: number
}

const NothingFound = (props: NothingFoundProps) => {
  return (
    <Delayed waitBeforeShow={props.waitBeforeShow}>
      <div className={s.nothingFound}>
        {props.children}
      </div>
    </Delayed>
  );
}

type Props = {
  children: React.ReactNode;
  waitBeforeShow: number;
};

const Delayed = ({ children, waitBeforeShow }: Props) => {
  const [isShown, setIsShown] = useState(false);
  const appContext = useContext(AppContext);

  useEffect(() => {
    const taskId = 'artificial-delay-before-rendering-nothing-found-component'
    appContext.startTask(taskId);

    const timeoutId = setTimeout(() => {
      setIsShown(true);
      appContext.finishTask(taskId);
    }, waitBeforeShow);

    return () => {
      appContext.finishTask(taskId);
      clearTimeout(timeoutId);
    }
  },
    // XXX - don't add appContext to deps here as eslint suggests.
    // It may cause infinite recursive calls. Fix it if you know how.
    [waitBeforeShow]
  );

  return isShown ? <>{children}</> : null;
};

export default NothingFound;
