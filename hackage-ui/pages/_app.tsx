import type { AppProps } from 'next/app'
import Head from 'next/head'
import { DefaultAppContextProvider } from '../components/AppContext';

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      {/* Show desktop version on mobile devices until we support it. */}
      {/* <meta name="viewport" content="width=1100, initial-scale=1, maximum-scale=1 shrink-to-fit=no"></meta> */}
    </Head>

    <DefaultAppContextProvider>
      <Component {...pageProps} />
    </DefaultAppContextProvider>
  </>
}

export default MyApp;
