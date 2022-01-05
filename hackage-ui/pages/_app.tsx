import type { AppProps } from 'next/app'
import Head from 'next/head'
import { DefaultAppContextProvider } from '../components/AppContext';

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
    </Head>

    <DefaultAppContextProvider>
      <Component {...pageProps} />
    </DefaultAppContextProvider>
  </>
}

export default MyApp;
