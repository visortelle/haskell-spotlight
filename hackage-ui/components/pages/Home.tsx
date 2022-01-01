import GlobalMenu, { defaultMenuProps } from "../layout/GlobalMenu";
import s from './Home.module.css';
import Button from "../forms/Button";
import PackageIcon from '!!raw-loader!../icons/package.svg';
import DownloadIcon from '!!raw-loader!../icons/download.svg';
import Footer from "../layout/Footer";

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
        <Stats downloadsTotal={1234324324} packagesTotal={34534534534} />
      </div>

      <div className={s.footer}>
        <Footer />
      </div>
    </div>
  );
}

type SvgIconProps = {
  svg: string
}

const SvgIcon = (props: SvgIconProps) => {
  return (<div className={s.svgIcon} dangerouslySetInnerHTML={{ __html: props.svg }}></div>);
}

type StatsProps = {
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
            <span className={s.statsAmount}>{props.downloadsTotal.toLocaleString('en-US')}</span>
            <span className={s.statsUnit}>Downloads</span>
          </div>
          <div className={s.statsGroupIcon}>
            <SvgIcon svg={DownloadIcon} />
          </div>
        </div>
        <div className={s.statsGroup}>
          <div className={s.statsGroupContent}>
            <span className={s.statsAmount}>{props.packagesTotal.toLocaleString('en-US')}</span>
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

