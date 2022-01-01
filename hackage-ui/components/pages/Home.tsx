import { useState, useEffect } from "react";
import axios from 'axios';
import GlobalMenu, { defaultMenuProps } from "../layout/GlobalMenu";
import s from './Home.module.css';
import Button from "../forms/Button";
import PackageIcon from '!!raw-loader!../icons/package.svg';
import DownloadIcon from '!!raw-loader!../icons/download.svg';
import Footer from "../layout/Footer";
import SvgIcon from "../icons/SVGIcon";
import PackageList from "../package-list/PackageList";
import MostDownloadedPackages from '../package-list/MostDownloadedPackages';
import RecentlyUpdatedPackages from "../package-list/RecentlyUpdatedPackages";

const Home = () => {
  return (
    <div className={s.home}>
      <GlobalMenu {...defaultMenuProps} />

      <div className={s.greeting}>
        <div className={s.greetingContent}>
          <h1 className={s.greetingHeader}>The Haskell community’s<br /> package registry</h1>
        </div>
      </div>
      <div className={s.gettingStarted}>
        <div>
          <Button onClick={() => { }} text="Install GHCup" type="promoButton" overrides={{ style: { width: '200rem' } }} />
        </div>
        <div style={{ width: '48rem' }}></div>
        <div>
          <Button onClick={() => { }} text="Getting Started" type="promoButton" overrides={{ style: { width: '200rem' } }} />
        </div>
      </div>

      <div className={s.statsContainer}>
        <Stats />
      </div>

      <div className={s.packageLists}>
        <div className={s.packageList}>
          <h3 className={s.packageListHeader}>Most Downloaded</h3>
          <MostDownloadedPackages />
        </div>

        <div className={s.packageList}>
          <h3 className={s.packageListHeader}>Just Updated</h3>
          <RecentlyUpdatedPackages />
        </div>

        <div className={s.packageList}>
          <h3 className={s.packageListHeader}>Recently Visited</h3>
          <PackageList pkgs={[]} getHref={() => '#'} count={0} />
        </div>
      </div>

      <div className={s.footer}>
        <Footer />
      </div>
    </div>
  );
}

type Stats = {
  downloadsTotal: number,
  packagesTotal: number
}

const Stats = () => {
  const [stats, setStats] = useState<'loading' | Stats>('loading');

  useEffect(() => {
    (async () => {
      const stats = await (await axios('/api/stats')).data;
      setStats(stats as Stats);
    })()
  }, []);

  if (stats === 'loading') {
    return null;
  }

  return (
    <div className={s.stats}>
      <div className={s.statsText}>
        <p className={s.statsTextParagraph}>
          Some text here.
          Some text here.
          Some text here.
          Some text here.
        </p>
        <p className={s.statsTextParagraph}>
          Some text here.
          Some text here.
          Some text here.
          Some text here.
        </p>
        <p className={s.statsTextParagraph}>
          Some text here.
          Some text here.
          Some text here.
          Some text here.
        </p>
      </div>
      <div className={s.statsGroups}>
        <div className={s.statsGroup}>
          <div className={s.statsGroupContent}>
            <span className={s.statsAmount}>{(stats.downloadsTotal && stats.downloadsTotal.toLocaleString('en-US')) || 'N/A'}</span>
            <span className={s.statsUnit}>Downloads</span>
          </div>
          <div className={s.statsGroupIcon}>
            <SvgIcon svg={DownloadIcon} />
          </div>
        </div>
        <div className={s.statsGroup}>
          <div className={s.statsGroupContent}>
            <span className={s.statsAmount}>{(stats.packagesTotal && stats.packagesTotal.toLocaleString('en-US') || 'N/A')}</span>
            <span className={s.statsUnit}>Packages published</span>
          </div>
          <div className={s.statsGroupIcon}>
            <SvgIcon svg={PackageIcon} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

