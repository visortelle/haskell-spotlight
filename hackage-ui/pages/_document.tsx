import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
          <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400&family=Fira+Sans:wght@400;700&display=swap" rel="stylesheet" />

          {/* eslint-disable @next/next/no-css-tags */}
          {/* Include stylesheets here is the only way I found to get rid of annoying styles flickering NextJS bug after each page reload. */}
          <link href="/styles/normalize.css" rel="stylesheet"></link>
          <link href="/styles/globals.css" rel="stylesheet"></link>


          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />

          {/* Empty script tag as chrome bug fix, see https://stackoverflow.com/a/42969608/943337 */}
          <script> </script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument
