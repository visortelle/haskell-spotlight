// Regular html <a /> tag, but that works properly with NextJS.

import { LinkHTMLAttributes } from 'react';
import Link, { LinkProps } from 'next/link';

type AProps = LinkHTMLAttributes<HTMLAnchorElement> & LinkProps;

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
      <a {...props} />
    </Link>
  );
}

export default A;
