import { useState, useEffect } from "react";
import PackageList from "./PackageList"
import axios from 'axios';
import { Package } from "./PackageList";

const count = 10;

export async function fetchTopPackages(): Promise<Package[]> {
  let html = '';

  try {
    html = await (await axios.get('/api/hackage/packages/top')).data;
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
    const name = td.getElementsByTagName('a')[0].innerHTML;
    return { name };
  });

  return pkgs;
}

const MostDownloaded = () => {
  const [topPackages, setTopPackages] = useState<'loading' | Package[]>('loading');

  useEffect(() => {
    (async () => {
      const topPackages = await fetchTopPackages();
      setTopPackages(topPackages);
    })()
  }, []);

  return <PackageList getHref={(pkg) => `https://hackage.haskell.org/package/${pkg.name}`} pkgs={topPackages} count={count} />
}

export default MostDownloaded;
