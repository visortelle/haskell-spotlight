import { NextPage, GetStaticPropsResult, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import DependenciesPage, { DependenciesPageProps } from '../../../components/pages/package/DependenciesPage';
import * as pkgFetch from '../../../fetch/package';

const Page: NextPage<DependenciesPageProps> = (props) => {
  return (
    <>
      <Head>
        <title>{props.package.name} - HaskellSpot: The Haskell community’s home page</title>
        <meta name="description" content={props.package.shortDescription || props.package.name}></meta>
      </Head>

      <DependenciesPage {...props} />
    </>
  );
}

export async function getStaticProps(props: GetStaticPropsContext): Promise<GetStaticPropsResult<DependenciesPageProps>> {
  const packageId = props.params!.packageId as string;
  const pkg = await pkgFetch.getPackage(packageId);

  if (pkg === null) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      package: pkg,
    },
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export default Page;
