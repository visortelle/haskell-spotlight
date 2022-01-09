import { NextPage, GetStaticPropsResult } from 'next';
import Head from 'next/head';
import React from 'react';
import { Package } from '../components/package-list/PackageList';
import HomePage, { HomeProps } from '../components/pages/home/HomePage';
import axios from 'axios';
import cheerio from 'cheerio';

const Page: NextPage<HomeProps> = (props) => {
  return (
    <>
      <Head>
        <title>Hackage: The Haskell community’s package registry</title>
        <meta name="description" content="Hackage is a package registry for Haskell"></meta>
      </Head>

      <HomePage {...props} />
    </>
  )
}

export async function getStaticProps(): Promise<GetStaticPropsResult<HomeProps>> {
  let pkgs: Array<unknown> = [];
  try {
    pkgs = await (
      await axios("https://hackage.haskell.org/packages/", {
        headers: { "Content-Type": "application/json" },
      })
    ).data;
  } catch (err) {
    console.log(err);
  }

  const packageListsSize = 10;

  let topPackages: Array<Package> = [];
  try {
    topPackages = await fetchTopPackages(packageListsSize);
  } catch (err) {
    console.log(err);
  }

  let recentlyUpdatedPackages: Array<Package> = [];
  try {
    recentlyUpdatedPackages = await fetchRecentlyUpdatedPackages(packageListsSize);
  } catch (err) {
    console.log(err);
  }

  return {
    props: {
      stats: {
        downloadsTotal: 0,
        packagesTotal: pkgs.length
      },
      topPackages,
      recentlyUpdatedPackages,
      packageListsSize
    },
    revalidate: 10
  }
}

async function fetchTopPackages(count: number): Promise<Package[]> {
  let html = '';

  try {
    html = await (await axios.get('https://hackage.haskell.org/packages/top')).data;
  } catch (err) {
    console.log(err);
  }

  const $ = cheerio.load(html);

  let tds;
  try {
    tds = $('#content td').slice(0, count * 2).filter(i => i % 2 === 0);
  } catch (err) {
    console.log(err);
  }

  const pkgs: Package[] = tds ? tds.map((_, td) => {
    const name = $('a', td).first().text();
    return { name };
  }).toArray() : [];

  return pkgs;
}

async function fetchRecentlyUpdatedPackages(count: number): Promise<Package[]> {
  let html = '';

  try {
    html = await (await axios.get('https://hackage.haskell.org/packages/recent')).data;
  } catch (err) {
    console.log(err);
  }

  const $ = cheerio.load(html);

  let tds;
  try {
    tds = $('#content td').slice(0, count * 3).filter((i) => (i + 1) % 3 === 0);
  } catch (err) {
    console.log(err);
  }

  const pkgs: Package[] = tds ? tds.map((_, td) => {
    const nameAndVersion = $('a', td).html() as string;
    const version = nameAndVersion.replace(/.*-(?=.+$)/, '');
    const name = nameAndVersion.slice(0, nameAndVersion.length - version.length - 1);
    return { name, version };
  }).toArray() : [];

  return pkgs;
}

export default Page;
