import { useState, useEffect } from "react";
import PackageList from "./PackageList"
import axios from 'axios';
import { Package } from "./PackageList";

const count = 10;

export async function fetchRecentlyUpdatedPackages(): Promise<Package[]> {
  let html = '';

  try {
    html = await (await axios.get('/api/hackage/packages/recent')).data;
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
    const nameAndVersion = td.getElementsByTagName('a')[0].innerHTML;
    const version = nameAndVersion.replace(/.*-(?=.+$)/, '');
    const name = nameAndVersion.slice(0, nameAndVersion.length - version.length - 1);
    return { name, version };
  });

  return pkgs;
}

const RecentlyUpdatedPackages = () => {
  const [topPackages, setTopPackages] = useState<'loading' | Package[]>('loading');

  useEffect(() => {
    (async () => {
      const topPackages = await fetchRecentlyUpdatedPackages();
      setTopPackages(topPackages);
    })()
  }, []);

  return <PackageList getHref={(pkg) => `/package/${pkg.name}-${pkg.version}`} pkgs={topPackages} count={count} />
}

export default RecentlyUpdatedPackages;
