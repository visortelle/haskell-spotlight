import GlobalMenu, { defaultMenuProps } from "../layout/GlobalMenu";
import s from './Home.module.css';
import Button from "../forms/Button";
import SidebarButton from "../forms/SidebarButton"; // Temporary here.
import PackageIcon from '!!raw-loader!../icons/package.svg';
import DownloadIcon from '!!raw-loader!../icons/download.svg';
import GitHubIcon from '!!raw-loader!../icons/github.svg';
import TwitterIcon from '!!raw-loader!../icons/twitter.svg';
import Footer from "../layout/Footer";
import SvgIcon from "../icons/SVGIcon";
import PackageList, { Package } from "../package-list/PackageList";
import AppContext from "../AppContext";
import { useContext, useEffect } from "react";

export type HomeProps = {
  stats: StatsProps,
  topPackages: Package[],
  recentlyUpdatedPackages: Package[]
  packageListsSize: number,
}

const screenName = 'HomePage';

const Home = (props: HomeProps) => {
  const appContext = useContext(AppContext);
  useEffect(() => {
    appContext.analytics?.gtag('event', 'screen_view', { screen_name: screenName });
  }, []);

  return (
    <div className={s.page}>
      <GlobalMenu {...defaultMenuProps} />

      <div className={s.greeting}>
        <div className={s.greetingContent}>
          <h1 className={s.greetingHeader}>The Haskell community’s<br /> package registry</h1>
        </div>
      </div>
      <div className={s.gettingStarted}>
        <div>
          <Button onClick={() => { }} type="promoButton" overrides={{ style: { width: '200rem' } }} analytics={{ featureName: 'Install Cabal', eventParams: { screen_name: screenName } }}>
            Install Cabal
          </Button>
        </div>
        <div style={{ width: '48rem' }}></div>
        <div>
          <Button onClick={() => { }} type="promoButton" overrides={{ style: { width: '200rem' } }} analytics={{ featureName: 'Getting Started', eventParams: { screen_name: screenName } }}>
            Getting Started
          </Button>
        </div>
      </div>

      <div className={s.statsContainer}>
        <Stats {...props.stats} />
      </div>

      <div className={s.packageLists}>
        <div className={s.packageList}>
          <h3 className={s.packageListHeader}>Most Downloaded</h3>
          <PackageList pkgs={props.topPackages} getHref={(pkg) => `/package/${pkg.name}`} count={props.packageListsSize} analytics={{ screenName }} />
        </div>

        <div className={s.packageList}>
          <h3 className={s.packageListHeader}>Just Updated</h3>
          <PackageList pkgs={props.recentlyUpdatedPackages} getHref={(pkg) => `/package/${pkg.name}`} count={props.packageListsSize} analytics={{ screenName }} />
        </div>

        <div className={s.packageList}>
          <h3 className={s.packageListHeader}>Recently Visited</h3>
          <PackageList pkgs={[]} getHref={() => '#'} count={0} analytics={{ screenName }} />
        </div>
      </div>

      <div className={s.footer}>
        <Footer />
      </div>
    </div>
  );
}

export type StatsProps = {
  downloadsTotal: number,
  packagesTotal: number
}

const Stats = (props: StatsProps) => {
  return (
    <div className={s.stats}>
      <div className={s.statsText}>
        <p className={s.statsTextParagraph}>
          This project is an alternative UI implementation for <a href="https://hackage.haskell.org">Hackage</a>.
        </p>
        <p className={s.statsTextParagraph}>The project is under construction.</p>
        <h3 style={{ marginBottom: '8rem' }}>You can help us to make it better</h3>
        <div className={s.statsTextParagraph}>
          <SidebarButton
            onClick={() => { }} href="https://github.com/visortelle/hackage-ui/issues/"
            overrides={{ style: { backgroundColor: 'var(--text-color)', marginBottom: '12rem', width: '240rem', justifyContent: 'flex-start' } }}
          >
            <SvgIcon svg={GitHubIcon} />
            <div>Contribute on GitHub</div>
          </SidebarButton>

          <SidebarButton
            onClick={() => { }} href="https://twitter.com/HackageUI"
            overrides={{ style: { backgroundColor: '#00ACEE', marginBottom: '12rem', width: '240rem', justifyContent: 'flex-start' } }}
          >
            <SvgIcon svg={TwitterIcon} />
            <div>Follow us on Twitter</div>
          </SidebarButton>
        </div>

        <div>
          Also you can sponsor the project or propose a job in Haskell project to <a href="mailto:visortelle@gmail.com">the author 🙂</a>
        </div>
      </div>
      <div className={s.statsGroups}>
        <div className={s.statsGroup}>
          <div className={s.statsGroupContent}>
            <span className={s.statsAmount}>{(props.downloadsTotal && props.downloadsTotal.toLocaleString('en-US')) || 'N/A'}</span>
            <span className={s.statsUnit}>Downloads</span>
          </div>
          <div className={s.statsGroupIcon}>
            <SvgIcon svg={DownloadIcon} />
          </div>
        </div>
        <div className={s.statsGroup}>
          <div className={s.statsGroupContent}>
            <span className={s.statsAmount}>{(props.packagesTotal && props.packagesTotal.toLocaleString('en-US') || 'N/A')}</span>
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
