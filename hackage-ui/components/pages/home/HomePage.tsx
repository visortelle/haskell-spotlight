import GlobalMenu, { defaultMenuProps } from "../../layout/GlobalMenu";
import s from './HomePage.module.css';
import Button from "../../forms/Button";
import SidebarButton from "../../forms/SidebarButton"; // Temporary here.
import PackageIcon from '!!raw-loader!../../icons/package.svg';
import DownloadIcon from '!!raw-loader!../../icons/download.svg';
import GitHubIcon from '!!raw-loader!../../icons/github.svg';
import TwitterIcon from '!!raw-loader!../../icons/twitter.svg';
import Footer from "../../layout/Footer";
import SvgIcon from "../../icons/SVGIcon";
import VerticalList, { Item } from "../../widgets/VerticalList";
import AppContext from "../../AppContext";
import { useContext, useEffect } from "react";

export type HomeProps = {
  editorsPick: Item[]
  packages: {
    recentlyUpdated: Item[],
    top: Item[],
    totalCount: number
  },
  community: {
    latest: Item[],
    hot: Item[],
    jobs: [],
  },
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
          <h1 className={s.greetingHeader}>The Haskell Community’s<br /> Home Page</h1>
        </div>
      </div>
      <div className={s.gettingStarted}>
        <div style={{ display: 'flex' }}>
          <SidebarButton
            onClick={() => { }} href="https://github.com/visortelle/hackage-ui/issues/"
            overrides={{ style: { flex: 'initial', backgroundColor: 'var(--text-color)', marginBottom: '12rem', justifyContent: 'flex-start', padding: '12rem 24rem', fontSize: '18rem', marginRight: '24rem' } }}
          >
            <SvgIcon svg={GitHubIcon} />
            <div>Contribute on GitHub</div>
          </SidebarButton>

          <SidebarButton
            onClick={() => { }} href="https://twitter.com/HackageUI"
            overrides={{ style: { flex: 'initial', backgroundColor: '#00ACEE', marginBottom: '12rem', justifyContent: 'flex-start', padding: '12rem 24rem', fontSize: '18rem' } }}
          >
            <SvgIcon svg={TwitterIcon} />
            <div>Follow us on Twitter</div>
          </SidebarButton>
        </div>
        <div style={{ width: '48rem' }}></div>
        <div>

        </div>
      </div>

      <h2 className={s.packageListsHeader}>Community</h2>
      <div className={s.packageLists}>

        <div className={s.packageList}>
          <h3 className={s.packageListHeader}>⭐️ Editor&apos;s Pick</h3>
          <VerticalList items={props.editorsPick} getHref={(item) => `/package/${item.title}`} count={props.packageListsSize} analytics={{ screenName }} />
        </div>

        <div className={s.packageList}>
          <h3 className={s.packageListHeader}>Haskell Jobs</h3>
          <VerticalList items={[]} getHref={(item) => `/package/${item.title}`} count={10} analytics={{ screenName }} />
        </div>
      </div>


      <h2 className={s.packageListsHeader}>Community</h2>
      <div className={s.packageLists}>

        <div className={s.packageList}>
          <h3 className={s.packageListHeader}>🔥 Hot</h3>
          <VerticalList items={props.community.latest} getHref={(item) => `/package/${item.title}`} count={props.packageListsSize} analytics={{ screenName }} />
        </div>

        <div className={s.packageList}>
          <h3 className={s.packageListHeader}>⏰ Latest</h3>
          <VerticalList items={props.community.latest} getHref={(item) => `/package/${item.title}`} count={props.packageListsSize} analytics={{ screenName }} />
        </div>

      </div>

      <h2 className={s.packageListsHeader}>
        📦 Packages
        <span style={{ opacity: '0.66', marginLeft: '8rem', fontSize: '18rem' }}>{props.packages.totalCount} total</span> {/* TODO - make it a link to the all packages list */}
      </h2>
      <div className={s.packageLists}>
        <div className={s.packageList}>
          <h3 className={s.packageListHeader}>Most Downloaded</h3>
          <VerticalList items={props.packages.top} getHref={(item) => `/package/${item.title}`} count={props.packageListsSize} analytics={{ screenName }} />
        </div>

        <div className={s.packageList}>
          <h3 className={s.packageListHeader}>Just Updated</h3>
          <VerticalList items={props.packages.recentlyUpdated} getHref={(item) => `/package/${item.title}`} count={props.packageListsSize} analytics={{ screenName }} />
        </div>

        <div className={s.packageList}>
          <h3 className={s.packageListHeader}>Recently Visited</h3>
          <VerticalList items={[]} getHref={() => '#'} count={0} analytics={{ screenName }} />
        </div>
      </div>

      <div className={s.footer}>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
