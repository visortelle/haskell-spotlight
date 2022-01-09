import { NextPage, GetStaticPropsResult } from 'next';
import Head from 'next/head';
import React from 'react';
import { Item } from '../components/widgets/VerticalList';
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

  let topPackages: Array<Item> = [];
  try {
    topPackages = await fetchTopPackages(packageListsSize);
  } catch (err) {
    console.log(err);
  }

  let recentlyUpdatedPackages: Array<Item> = [];
  try {
    recentlyUpdatedPackages = await fetchRecentlyUpdatedPackages(packageListsSize);
  } catch (err) {
    console.log(err);
  }

  return {
    props: {
      packages: {
        recentlyUpdated: recentlyUpdatedPackages,
        top: topPackages,
        totalCount: pkgs.length
      },
      editorsPick: [
        {
          title: 'State of the Haskell ecosystem',
          href: 'https://github.com/Gabriel439/post-rfc/blob/main/sotu.md',
          description: 'by Gabriella Gonzalez',
        },
        {
          title: '🧙‍♂️ Mentor for beginner Haskeller available',
          href: 'https://github.com/haskellfoundation/volunteering/issues/8',
          description: 'One one hour session per month, 30 minutes of code review per week.',
        },
        {
          title: 'Volunteer Available. Frontend, DevOps. ',
          href: 'https://github.com/haskellfoundation/volunteering/issues/3',
          description: 'The author of this project is looking for a Haskell project to join.',
        }
      ],
      community: {
        latest: [],
        hot: [],
        jobs: []
      },
      packageListsSize
    },
    revalidate: 30
  }
}

async function fetchTopPackages(count: number): Promise<Item[]> {
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

  const items: Item[] = tds ? tds.map((_, td) => {
    const name = $('a', td).first().text();
    return { title: name };
  }).toArray() : [];

  return items;
}

async function fetchRecentlyUpdatedPackages(count: number): Promise<Item[]> {
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

  const items: Item[] = tds ? tds.map((_, td) => {
    const nameAndVersion = $('a', td).html() as string;
    const version = nameAndVersion.replace(/.*-(?=.+$)/, '');
    const name = nameAndVersion.slice(0, nameAndVersion.length - version.length - 1);
    return { title: name, description: version };
  }).toArray() : [];

  return items;
}

export default Page;
