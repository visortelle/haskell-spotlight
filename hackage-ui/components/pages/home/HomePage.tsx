import GlobalMenu, { defaultMenuProps } from "../../layout/GlobalMenu";
import s from './HomePage.module.css';
import SidebarButton from "../../forms/SidebarButton"; // Temporary here.
import SvgIcon from "../../icons/SVGIcon";
import gitHubIcon from '!!raw-loader!../../icons/github.svg';
import twitterIcon from '!!raw-loader!../../icons/twitter.svg';
import discourseIcon from '!!raw-loader!../../icons/discourse.svg';
import redditIcon from '!!raw-loader!../../icons/reddit.svg';
import haskellMonochromeIcon from '!!raw-loader!../../icons/haskell-monochrome.svg';
import Footer from "../../layout/Footer";
import VerticalList, { Item } from "../../widgets/VerticalList";
import * as lib from "@hackage-ui/react-lib";
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
  const appContext = useContext(lib.appContext.AppContext);

  useEffect(() => {
    appContext.analytics?.gtag('event', 'screen_view', { screen_name: screenName });
  }, []);

  return (
    <div className={s.page}>
      <GlobalMenu {...defaultMenuProps} />

      <div className={s.greeting}>
        <div className={s.greetingContent}>
          <h1 className={s.greetingHeader}>The Haskell Community’s<br /> Home Page</h1>

          <div className={s.gettingStarted}>
            <SidebarButton
              onClick={() => { }} href="https://github.com/visortelle/hackage-ui/issues/"
              overrides={{ style: { flex: 'initial', backgroundColor: 'var(--text-color)', marginBottom: '12rem', justifyContent: 'flex-start', padding: '12rem 24rem', fontSize: '18rem', marginRight: '24rem' } }}
            >
              <SvgIcon svg={gitHubIcon} />
              <div>Contribute on GitHub</div>
            </SidebarButton>

            <SidebarButton
              onClick={() => { }} href="https://twitter.com/HackageUI"
              overrides={{ style: { flex: 'initial', backgroundColor: '#00ACEE', marginBottom: '12rem', justifyContent: 'flex-start', padding: '12rem 24rem', fontSize: '18rem' } }}
            >
              <SvgIcon svg={twitterIcon} />
              <div>Follow us on Twitter</div>
            </SidebarButton>
          </div>
        </div>

      </div>

      <div className={s.content}>

        <h2 className={s.packageListsHeader}>
          Community
          <lib.links.ExtA href="https://haskell.foundation/" analytics={{ featureName: 'GoToHaskellFoundation', eventParams: {} }} className={s.packageListsHeaderLink}>
            <div className={s.packageListsHeaderIcon} style={{ fill: 'var(--purple-color-1)' }}><SvgIcon svg={haskellMonochromeIcon} /></div>Haskell Foundation
          </lib.links.ExtA>

          <lib.links.ExtA href="https://discourse.haskell.org/" analytics={{ featureName: 'GoToDiscourse', eventParams: {} }} className={s.packageListsHeaderLink} style={{ background: '#fff', color: 'var(--text-color)' }}>
            <div className={s.packageListsHeaderIcon} style={{ fill: 'var(--text-color)' }}><SvgIcon svg={discourseIcon} /></div>Discourse
          </lib.links.ExtA>

          <lib.links.ExtA href="https://www.reddit.com/r/haskell" analytics={{ featureName: 'GoToReddit', eventParams: {} }} className={s.packageListsHeaderLink} style={{ background: '#fff', color: 'var(--text-color)' }}>
            <div className={s.packageListsHeaderIcon} style={{ fill: 'var(--text-color)' }}><SvgIcon svg={redditIcon} /></div>Reddit
          </lib.links.ExtA>
        </h2>

        <div className={s.packageLists}>

          <div className={s.packageList}>
            <h3 className={s.packageListHeader}>🔥 Hot</h3>
            <VerticalList items={props.community.latest} getHref={(item) => `/package/${item.title}`} count={props.packageListsSize} analytics={{ screenName }} linksType="external" />
          </div>

          <div className={s.packageList}>
            <h3 className={s.packageListHeader}>⏰ Latest</h3>
            <VerticalList items={props.community.latest} getHref={(item) => `/package/${item.title}`} count={props.packageListsSize} analytics={{ screenName }} linksType="external" />
          </div>

        </div>

        <div className={s.packageLists}>

          <div className={s.packageList}>
            <h3 className={s.packageListHeader}>⭐️ Editor&apos;s Pick</h3>
            <VerticalList items={props.editorsPick} getHref={(item) => `/package/${item.title}`} count={props.packageListsSize} analytics={{ screenName }} linksType="external" />
          </div>

          <div className={s.packageList}>
            <h3 className={s.packageListHeader}>Haskell Jobs</h3>
            <VerticalList items={[]} getHref={(item) => `/package/${item.title}`} count={10} analytics={{ screenName }} linksType="external" />
          </div>
        </div>

        <h2 className={s.packageListsHeader}>
          📦 Packages
          <span style={{ opacity: '0.66', marginLeft: '8rem', fontSize: '18rem' }}>{props.packages.totalCount} total</span> {/* TODO - make it a link to the all packages list */}
        </h2>
        <div className={s.packageLists}>
          <div className={s.packageList}>
            <h3 className={s.packageListHeader}>Most Downloaded</h3>
            <VerticalList items={props.packages.top} getHref={(item) => `/package/${item.title}`} count={props.packageListsSize} analytics={{ screenName }} linksType="internal" />
          </div>

          <div className={s.packageList}>
            <h3 className={s.packageListHeader}>Just Updated</h3>
            <VerticalList items={props.packages.recentlyUpdated} getHref={(item) => `/package/${item.title}`} count={props.packageListsSize} analytics={{ screenName }} linksType="internal" />
          </div>

          <div className={s.packageList}>
            <h3 className={s.packageListHeader}>Recently Visited</h3>
            <VerticalList items={[]} getHref={() => '#'} count={0} analytics={{ screenName }} linksType="internal" />
          </div>
        </div>

        <div className={s.footer}>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;
