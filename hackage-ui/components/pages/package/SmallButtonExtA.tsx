import * as lib from '@hackage-ui/react-lib';
import s from './SmallButton.module.css';
import openInNewTabIcon from '!!raw-loader!../../icons/open-in-new-tab.svg';
import SVGIcon from '../../icons/SVGIcon';

export type SmallButtonExtAProps = {
  href: string,
  title: string
}

const SmallButtonExtA = (props: SmallButtonExtAProps) => {
  return (
    <lib.links.ExtA className={s.button} target='__blank' href={props.href} analytics={{ featureName: `Click-${props.title}`, eventParams: {} }}>
      <SVGIcon svg={openInNewTabIcon} />{props.title}
    </lib.links.ExtA>
  );
}

export default SmallButtonExtA;
