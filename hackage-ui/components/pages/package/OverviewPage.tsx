import s from './OverviewPage.module.css';
import { PackageProps } from "./common";
import Layout from "./Layout";

const screenName = 'PackageOverviewPage';

const OverviewPage = (props: PackageProps) => {
  return (
    <Layout analytics={{ screenName }} package={props} activeTab="overview">
      <div className={s.package}>
        <div className={s.content}>
          {props.longDescriptionHtml && <div className={s.longDescription} dangerouslySetInnerHTML={{ __html: props.longDescriptionHtml }}></div>}
        </div>
      </div>
    </Layout>
  );
}

export default OverviewPage;
