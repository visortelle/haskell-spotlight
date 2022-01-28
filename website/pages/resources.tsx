import { NextPage, GetStaticPropsResult, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import ResourcesPage, { ResourcesPageProps } from '../components/pages/resources/ResourcesPage';

const Page: NextPage<ResourcesPageProps> = () => {
  return (
    <>
      <Head>
        <title>HaskellSpot: The Haskell community’s home page</title>
        <meta name="description" content="Haskell - available resources"></meta>
      </Head>

      <ResourcesPage />
    </>
  );
}

export async function getStaticProps(props: GetStaticPropsContext): Promise<GetStaticPropsResult<ResourcesPageProps>> {
  return {
    props: {},
    revalidate: 180
  }
}

export default Page;
