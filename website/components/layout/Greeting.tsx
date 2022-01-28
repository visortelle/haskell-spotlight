import { ReactNode } from 'react';
import s from './Greeting.module.css';

export type GreetingProps = {
  header: ReactNode,
  children: ReactNode
}

const Greeting = (props: GreetingProps) => {
  return (
    <div className={s.greeting}>
      <div className={s.greetingContent}>
        <h1 className={s.greetingHeader}>{props.header}</h1>

        {props.children}
      </div>
    </div>
  );
}

export default Greeting;
