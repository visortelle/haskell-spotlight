// Regular html <a /> tag, but that works properly with NextJS.

import React, { LinkHTMLAttributes, forwardRef, ForwardedRef, useContext } from 'react';
import Link, { LinkProps } from 'next/link';
import { AppContext } from '../AppContext/AppContext';
import omit from 'lodash/omit';

type ExtAProps = LinkHTMLAttributes<HTMLAnchorElement> & { analytics: { featureName: string, eventParams: Gtag.EventParams } };
type AProps = ExtAProps & LinkProps;

// eslint-disable-next-line react/display-name
export const ExtA = forwardRef((props: ExtAProps, ref: ForwardedRef<HTMLAnchorElement>) => {
  const appContext = useContext(AppContext);

  return (
    <a
      ref={ref}
      {...omit(props, 'analytics')}
      onClick={(e) => {
        appContext.analytics?.gtag('event', `FeatureUsed`, {
          description: props.href,
          event_label: props.analytics.featureName,
          ...props.analytics.eventParams
        });

        if (props.onClick) {
          props.onClick(e);
        }
      }} />
  );
});

export const A = (props: AProps) => {
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
