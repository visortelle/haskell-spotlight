import { NextPage, GetStaticPropsResult, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import VersionsPage, { VersionsPageProps } from '../../../components/pages/package/VersionsPage';
import * as pkgFetch from '../../../fetch/package';

const Page: NextPage<VersionsPageProps> = (props) => {
  return (
    <>
      <Head>
        <title>{props.package.name} - Hackage: The Haskell community’s package registry</title>
        <meta name="description" content={props.package.shortDescription || props.package.name}></meta>
      </Head>

      <VersionsPage {...props} />
    </>
  );
}

export async function getStaticProps(props: GetStaticPropsContext): Promise<GetStaticPropsResult<VersionsPageProps>> {
  const packageId = props.params!.packageId as string;
  const pkg = await pkgFetch.getPackage(packageId);

  if (pkg === null) {
    return {
      notFound: true,
      revalidate: 10
    }
  }

  return {
    props: {
      package: pkg,
    },
    revalidate: 180
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export default Page;
