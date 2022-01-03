import { NextPage, GetStaticPropsResult } from 'next';
import React from 'react';
import { Package } from '../components/package-list/PackageList';
import HomePage, { HomeProps } from '../components/pages/Home';
import axios from 'axios';
import { DOMParser } from 'xmldom';

const Page: NextPage<HomeProps> = (props) => {
  return (
    <HomePage {...props} />
  )
}

export async function fetchTopPackages(count: number): Promise<Package[]> {
  let html = '';

  try {
    html = await (await axios.get('https://hackage.haskell.org/packages/top')).data;
  } catch (err) {
    console.log(err);
  }

  const domParser = new DOMParser();
  const doc = domParser.parseFromString(html, 'text/html');

  let tds: HTMLTableCellElement[] = [];
  try {
    tds = Array.from((doc.getElementById('content') as HTMLElement).getElementsByTagName('td')).slice(0, count * 2).filter((_, i) => i % 2 === 0);
  } catch (err) {
    console.log(err);
  }

  const pkgs: Package[] = tds.map((td) => {
    const name = td.getElementsByTagName('a')[0].childNodes[0].nodeValue as string;
    return { name };
  });

  return pkgs;
}

export async function fetchRecentlyUpdatedPackages(count: number): Promise<Package[]> {
  let html = '';

  try {
    html = await (await axios.get('https://hackage.haskell.org/packages/recent')).data;
  } catch (err) {
    console.log(err);
  }

  const domParser = new DOMParser();
  const doc = domParser.parseFromString(html, 'text/html');

  let tds: HTMLTableCellElement[] = [];
  try {
    tds = Array.from((doc.getElementById('content') as HTMLElement).getElementsByTagName('td')).slice(0, count * 3).filter((_, i) => (i + 1) % 3 === 0);
  } catch (err) {
    console.log(err);
  }

  const pkgs: Package[] = tds.map((td) => {
    const nameAndVersion = td.getElementsByTagName('a')[0].childNodes[0].nodeValue as string;
    const version = nameAndVersion.replace(/.*-(?=.+$)/, '');
    const name = nameAndVersion.slice(0, nameAndVersion.length - version.length - 1);
    return { name, version };
  });

  return pkgs;
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

export default Page;
