import { useEffect } from "react";
import { useRouter } from "next/router";
export const gaTrackingId = 'G-3LYZX9KW55';

export type State = null | 'enabled' | 'disabled';

export const disable = (): void => {
  gtag('consent', 'update', { ad_storage: 'denied', analytics_storage: 'denied' });
};

export const enable = (): void => {
  gtag('consent', 'update', { ad_storage: 'denied', analytics_storage: 'granted' });
};

export type AnalyticsState = {
  gtag: Gtag.Gtag | ((args: any) => void),
  categories: typeof categories
}

export const Analytics = (props: { onChange: (state: AnalyticsState) => void }) => {
  useEffect(() => {
    props.onChange({
      categories,
      gtag: (global as any).gtag || (() => { })
    });
  }, []);

  return (
    <RouterEventListener />
  );
}

const RouterEventListener = () => {
  const router = useRouter();

  const handleRouteChange = (_: any, { shallow }: { shallow: boolean }) => {
    if (shallow) {
      return;
    }

    if (typeof (global as any).gtag === 'function') {
      gtag('set', 'page_path', document.location.origin + document.location.pathname);
      gtag('event', 'page_view');
    }
  };

  useEffect(() => {
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  return null;
}

export enum categories {
  'general',
  'search',
  'issues',
}
