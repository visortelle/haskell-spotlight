import s from './HaskellIcon.module.css';
import SVGIcon from '../icons/SVGIcon';
import haskellIcon from '!!raw-loader!../icons/haskell-monochrome.svg';

export type HaskellIconProps = {
  iconAddonSvg?: string
}

const HaskellIcon = (props: HaskellIconProps) => {
  return (
    <div className={s.container}>
      <div className={s.icon}>
        <SVGIcon svg={haskellIcon} />
      </div>
      {props.iconAddonSvg && <div className={s.iconAddon}><SVGIcon svg={props.iconAddonSvg} /></div>}
    </div>
  );
}

export default HaskellIcon;
