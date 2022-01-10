import s from './VerticalList.module.css';
import ArrowRightIcon from '!!raw-loader!../../components/icons/arrow-right.svg';
import SvgIcon from '../icons/SVGIcon';
import * as lib from '@hackage-ui/react-lib';

export type Item = {
  title: string,
  href?: string,
  description?: string,
}

export type Props = {
  items: 'loading' | Item[],
  getHref: (item: Item) => string,
  count: number,
  analytics: { screenName: string },
  linksType: 'internal' | 'external'
}

const VerticalList = (props: Props) => {
  const Link = props.linksType === 'external' ? lib.links.ExtA : lib.links.A;

  return (
    <div className={s.verticalList}>
      {props.items === 'loading' && (
        Array.from(Array(props.count)).map((_, i) => <div key={i} className={`${s.loading} loading-overlay`}></div>)
      )}
      {props.items !== 'loading' && props.items.length === 0 && (
        <div className={`${s.nothingToShow}`}><span>Nothing to show</span></div>
      )}
      {props.items !== 'loading' && props.items.length > 0 && props.items.map((c) => {
        return (
          <Link
            key={`${c.title}@${c.description || 'no-description'}`}
            className={s.contentEntry}
            href={c.href ? c.href : props.getHref(c)}
            analytics={{ featureName: 'VerticalListItemClick', eventParams: { screen_name: props.analytics.screenName } }}
          >
            <div className={s.contentEntryMain}>
              <div className={s.title}>{c.title}</div>
              <div className={s.description}>{c.description}</div>
            </div>
            <div className={s.openIcon}>
              <SvgIcon svg={ArrowRightIcon} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default VerticalList;
