import GlobalMenu, { defaultMenuProps } from "../../layout/GlobalMenu";
import s from './ResourcesPage.module.css';
import * as lib from "@hackage-ui/react-lib";
import Layout from './layout/Layout';

export type ResourcesPageProps = {

}

const screenName = 'ResourcesPage';

const ResourcesPage = (props: ResourcesPageProps) => {
  return (
    <Layout analytics={{ screenName }}>
      <lib.links.A href="/resources/developer-tools" analytics={{ featureName: 'ClickResourcesPageLink', eventParams: {} }}>
        Developer tools
      </lib.links.A>

      {/*
        - [ ] Add section about low level tools lit
        <h2>Community</h2>
        <p>Community Dashboard</p>
        <p>Events</p>
        <p>Haskell Foundation</p>
        <p>Discord</p>
        <p>Slack</p>

        <h2>Packages</h2>
        <p>Browse packages</p>
        <p>hackage.haskell.org</p>
        <p>stackage.org</p>
        <p>Ecosystem overview by Gabriella</p>

        <h2>Documentation, Books, And Videos</h2>
        <h2>Podcasts</h2>

        <h2>Industry (who uses)</h2> */}
    </Layout>
  );
}

export default ResourcesPage;
