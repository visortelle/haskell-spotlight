import GlobalMenu, { defaultMenuProps } from "../layout/GlobalMenu";
import s from './Home.module.css';
import Button from "../forms/Button";
import PackageIcon from '!!raw-loader!../icons/package.svg';
import DownloadIcon from '!!raw-loader!../icons/download.svg';
import Footer from "../layout/Footer";
import SvgIcon from "../icons/SVGIcon";
import PackageList, { Package } from "../package-list/PackageList";

export type HomeProps = {
  stats: StatsProps,
  topPackages: Package[],
  recentlyUpdatedPackages: Package[]
  packageListsSize: number,
}

const Home = (props: HomeProps) => {
  return (
    <div className={s.page}>
      <GlobalMenu {...defaultMenuProps} />

      <div className={s.greeting}>
        <div className={s.greetingContent}>
          <h1 className={s.greetingHeader}>The Haskell community’s<br /> package registry</h1>
          <a style={{ color: '#fff', marginTop: '24rem' }} target="__blank" href="https://github.com/visortelle/hackage-ui">🚧 The project is under construction and looking for cooperation. 🚧</a>
        </div>
      </div>
      <div className={s.gettingStarted}>
        <div>
          <Button onClick={() => { }} text="Install Cabal" type="promoButton" overrides={{ style: { width: '200rem' } }} />
        </div>
        <div style={{ width: '48rem' }}></div>
        <div>
          <Button onClick={() => { }} text="Getting Started" type="promoButton" overrides={{ style: { width: '200rem' } }} />
        </div>
      </div>

      <div className={s.statsContainer}>
        <Stats {...props.stats} />
      </div>

      <div className={s.packageLists}>
        <div className={s.packageList}>
          <h3 className={s.packageListHeader}>Most Downloaded</h3>
          <PackageList pkgs={props.topPackages} getHref={(pkg) => `/package/${pkg.name}`} count={props.packageListsSize} />
        </div>

        <div className={s.packageList}>
          <h3 className={s.packageListHeader}>Just Updated</h3>
          <PackageList pkgs={props.recentlyUpdatedPackages} getHref={(pkg) => `/package/${pkg.name}`} count={props.packageListsSize} />
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

export type StatsProps = {
  downloadsTotal: number,
  packagesTotal: number
}

const Stats = (props: StatsProps) => {
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
