import type { AppProps } from 'next/app'
import Head from 'next/head'
import { appContext } from '@haskell-spotlight/react-lib';
import '@haskell-spotlight/react-lib/dist/react-lib.css';
import 'react-toastify/dist/ReactToastify.css';
import 'highlight.js/styles/kimbie-light.css';
import { useRouter } from 'next/router';
import { useEffect, useCallback, useContext } from 'react';


const MyApp = (props: AppProps) => {
  return <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
    </Head>

    <appContext.DefaultAppContextProvider useNextJSRouting={true}>
      <ComponentWithProgressIndicator {...props} />
    </appContext.DefaultAppContextProvider>
  </>
}

const taskName = 'page-loading';

const ComponentWithProgressIndicator = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const context = useContext(appContext.AppContext);

  const handleRouteChangeStart = useCallback(() => {
    context.startTask(taskName);
  }, []);

  const handleRouteChangeEnd = useCallback(() => {
    context.finishTask(taskName);
  }, []);

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeEnd);
    router.events.on("routeChangeError", handleRouteChangeEnd);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeEnd);
      router.events.off("routeChangeError", handleRouteChangeEnd);
    };
  }, [router, handleRouteChangeStart, handleRouteChangeEnd]);

  return (
    <Component {...pageProps} />
  );
}

export default MyApp;
