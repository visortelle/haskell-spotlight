import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=1000" />
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
