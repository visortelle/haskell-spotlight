// Regular html <a /> tag, but that works properly with NextJS.

import React, { AnchorHTMLAttributes, forwardRef, ForwardedRef, useContext } from 'react';
import Link, { LinkProps } from 'next/link';
import { AppContext } from '../AppContext/AppContext';
import pick from 'lodash/pick';

type ExtAProps = AnchorHTMLAttributes<HTMLAnchorElement> & { analytics: { featureName: string, eventParams: Gtag.EventParams } };
type AProps = ExtAProps & LinkProps;

// eslint-disable-next-line react/display-name
export const ExtA = forwardRef((props: ExtAProps, ref: ForwardedRef<HTMLAnchorElement>) => {
  const appContext = useContext(AppContext);

  return (
    <a
      ref={ref}
      {...pick(props, ['href', 'target', 'children', 'className', 'style'])}
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
