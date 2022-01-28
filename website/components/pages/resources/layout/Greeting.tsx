import { ReactNode } from 'react';
import s from './Greeting.module.css';
import SVGIcon from '../../../icons/SVGIcon';
import haskellIcon from '!!raw-loader!../../../icons/haskell-monochrome.svg';


const Greeting = () => {
  return (
    <div className={s.greeting}>
      <div className={s.greetingContent}>
        <div className={s.header}><SVGIcon svg={haskellIcon} /><h1 className={s.text}>Haskell</h1></div>
        <p className={s.secondaryText}>The reliable purely functional programming language.</p>
      </div>
    </div>
  );
}

export default Greeting;
