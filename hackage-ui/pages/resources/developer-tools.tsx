import { NextPage, GetStaticPropsResult, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import DevelopmentEnvironmentPage, { DevelopmentEnvironmentPageProps } from '../../components/pages/resources/DeveloperToolsPage';

const Page: NextPage<DevelopmentEnvironmentPageProps> = () => {
  return (
    <>
      <Head>
        <title>Hackage: The Haskell community’s package registry</title>
        <meta name="description" content="Haskell - available resources"></meta>
      </Head>

      <DevelopmentEnvironmentPage />
    </>
  );
}

export async function getStaticProps(props: GetStaticPropsContext): Promise<GetStaticPropsResult<DevelopmentEnvironmentPageProps>> {
  return {
    props: {},
    revalidate: 180
  }
}

export default Page;

