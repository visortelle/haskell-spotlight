import { NextPage, GetStaticPropsResult } from 'next';
import Head from 'next/head';
import React from 'react';
import HomePage from '../components/pages/resources/HomePage';

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>HaskellSpot: The Haskell community’s home page</title>
        <meta name="description" content="HaskellSpot: The Haskell community’s home page"></meta>
      </Head>

      <HomePage />
    </>
  )
}

export default Page;
