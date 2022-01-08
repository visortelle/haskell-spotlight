// Regular html <a /> tag, but that works properly with NextJS.

import { LinkHTMLAttributes, forwardRef, ForwardedRef, useContext } from 'react';
import Link, { LinkProps } from 'next/link';
import AppContext from '../AppContext';

type ExtAProps = LinkHTMLAttributes<HTMLAnchorElement> & { analytics: { featureName: string, eventParams: Gtag.EventParams } };
type AProps = ExtAProps & LinkProps;

// eslint-disable-next-line react/display-name
export const ExtA = forwardRef((props: ExtAProps, ref: ForwardedRef<HTMLAnchorElement>) => {
  const appContext = useContext(AppContext);

  return (
    <a
      ref={ref}
      {...props}
      onClick={(e) => {
        appContext?.analytics?.gtag('event', `FeatureUsed`, {
          event_label: props.href,
          label: props.analytics.featureName,
          ...props.analytics.eventParams
        });

        if (props.onClick) {
          props.onClick(e);
        }
      }} />
  );
});

const A = (props: AProps) => {
  return (
    <Link
      href={props.href || '#'}
      scroll={props.scroll}
      as={props.as}
      locale={props.locale}
      prefetch={props.prefetch}
      shallow={props.shallow}
      replace={props.replace}
      passHref={props.passHref}
    >
      <ExtA {...props} />
    </Link>
  );
}

export default A;
