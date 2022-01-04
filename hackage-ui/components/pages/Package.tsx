import GlobalMenu, { defaultMenuProps } from "../layout/GlobalMenu";
import Footer from "../layout/Footer";
import s from './Package.module.css';

export type PackageProps = {
  id: string,
  name: string,
  shortDescription: string,
  longDescriptionHtml: string
}

const Package = (props: PackageProps) => {
  return (
    <div className={s.page}>
      <GlobalMenu {...defaultMenuProps} />
      <div className={s.package}>
        <div className={s.content}>
          <div className={s.briefInfo}>
            <div className={s.packageName}><small>📦</small>&nbsp;<h1 className={s.packageNameH1}>{props.name}</h1></div>
            {props.shortDescription && <div className={s.shortDescription}>{props.shortDescription}</div>}
            {props.longDescriptionHtml && <div className={s.longDescription} dangerouslySetInnerHTML={{ __html: props.longDescriptionHtml }}></div>}
          </div>
        </div>
      </div>
      <div className={s.footer}>
        <Footer />
      </div>
    </div>
  );
}

// Left sidebar:
// Tabs:
// readme - https://hackage.haskell.org/api#package-contents /package/:package/readme,
// changelog - https://hackage.haskell.org/api#package-contents /package/:package/changelog,
// versions, - versions list + info from this page if exists.
// dependencies,
// dependents
// This PR should make it easier: https://github.com/haskell/hackage-server/pull/996

export default Package;
