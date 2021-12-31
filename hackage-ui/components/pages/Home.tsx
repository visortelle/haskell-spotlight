import GlobalMenu, { defaultMenuProps } from "../layout/GlobalMenu";
import s from './Home.module.css';
import Button from "../forms/Button";

const Home = () => {
  return (
    <div>
      <GlobalMenu {...defaultMenuProps} />
      <div className={s.greeting}>
        <div className={s.greetingContent}>
          <h1 className={s.greetingHeader}>The Haskell community’s<br /> package registry</h1>
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
        <Stats downloadsTotal={1234324324} packagesTotal={34534534534} />
      </div>
      <div className={s.statsContainer}>
        <Stats downloadsTotal={1234324324} packagesTotal={34534534534} />
      </div>
      <div className={s.statsContainer}>
        <Stats downloadsTotal={1234324324} packagesTotal={34534534534} />
      </div>

      <div className={s.statsContainer}>
        <Stats downloadsTotal={1234324324} packagesTotal={34534534534} />
      </div>
      <div className={s.statsContainer}>
        <Stats downloadsTotal={1234324324} packagesTotal={34534534534} />
      </div>
      <div className={s.statsContainer}>
        <Stats downloadsTotal={1234324324} packagesTotal={34534534534} />
      </div>
      <div className={s.statsContainer}>
        <Stats downloadsTotal={1234324324} packagesTotal={34534534534} />
      </div>
      <div className={s.statsContainer}>
        <Stats downloadsTotal={1234324324} packagesTotal={34534534534} />
      </div>
    </div>
  );
}

type StatsProps = {
  downloadsTotal: number,
  packagesTotal: number
}

const Stats = (props: StatsProps) => {
  return (
    <div className={s.stats}>
      <div className={s.statsText}>
        Instantly publish your packages and install them.
        <br />
        Use the API to interact and find out more information about available packages.
        <br />
        Become a contributor and enhance the site with your work.
      </div>
      <div className={s.statsGroups}>
        <div className={s.statsGroup}>
          <span className={s.statsAmount}>{props.downloadsTotal}</span>
          <span className={s.statsUnit}>Downloads</span>
        </div>
        <div className={s.statsGroup}>
          <span className={s.statsAmount}>{props.packagesTotal}</span>
          <span className={s.statsUnit}>Packages in stock</span>
        </div>

      </div>
    </div>
  );
}

export default Home;

