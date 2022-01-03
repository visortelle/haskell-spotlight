import { NextPage } from 'next';
import PackagePage from '../../components/pages/Package';
import { useRouter } from 'next/router';

const Page: NextPage = () => {
  const router = useRouter();
  const packageId = router.query.packageId as string;

  return (
    <PackagePage id={packageId} />
  );
}

export default Page;
