import { NextPage, GetStaticPropsResult, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import OverviewPage from '../../components/pages/package/OverviewPage';
import { PackageProps } from '../../components/pages/package/common';
import * as pkgFetch from '../../fetch/package';

const Page: NextPage<PackageProps> = (props) => {
  return (
    <>
      <Head>
        <title>{props.id} - Hackage: The Haskell community’s package registry</title>
        <meta name="description" content={props.shortDescription || props.name}></meta>
      </Head>

      <OverviewPage {...props} />
    </>
  );
}

export async function getStaticProps(props: GetStaticPropsContext): Promise<GetStaticPropsResult<PackageProps>> {
  const packageId = props.params!.packageId as string;
  const pkg = await pkgFetch.getPackage(packageId);

  return {
    props: pkg,
    revalidate: 60
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export default Page;
