import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
