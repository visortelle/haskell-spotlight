import { NextPage, GetStaticPropsResult, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import DevelopmentEnvironmentPage, { DevelopmentEnvironmentPageProps } from '../../components/pages/resources/DeveloperToolsPage';

const Page: NextPage<DevelopmentEnvironmentPageProps> = () => {
  return (
    <>
      <Head>
        <title>HaskellSpot: The Haskell community’s home page</title>
        <meta name="description" content="Haskell - available resources"></meta>
      </Head>

      <DevelopmentEnvironmentPage />
    </>
  );
}

export async function getStaticProps(props: GetStaticPropsContext): Promise<GetStaticPropsResult<DevelopmentEnvironmentPageProps>> {
  return {
    props: {},
  }
}

export default Page;

