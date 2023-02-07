import { NextPage, GetStaticPropsResult } from 'next';
import Head from 'next/head';
import React from 'react';

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>VSCode Extension</title>
      </Head>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <a style={{ fontSize: '24rem'}} href="https://marketplace.visualstudio.com/items?itemName=visortelle.haskell-spotlight">Haskell Spotlight VSCode extension</a>
      </div>
    </>
  )
}

export default Page;
