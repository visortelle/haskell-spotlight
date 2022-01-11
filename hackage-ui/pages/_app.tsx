import type { AppProps } from 'next/app'
import Head from 'next/head'
import { appContext } from '@hackage-ui/react-lib';
import '@hackage-ui/react-lib/dist/react-lib.css';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
    </Head>

    <appContext.DefaultAppContextProvider>
      <Component {...pageProps} />
    </appContext.DefaultAppContextProvider>
  </>
}

export default MyApp;
