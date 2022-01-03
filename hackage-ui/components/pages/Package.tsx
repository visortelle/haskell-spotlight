import GlobalMenu, { defaultMenuProps } from "../layout/GlobalMenu";
import axios from 'axios';
import { useState, useEffect } from "react";
import s from './Package.module.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/a11y-dark.css'; // dark theme candidates - a11y-dark

// XXX - We can get rid of most content of this function after the hackage-server will implement missing APIs.
function monkeyPatchDocument(doc: Document): void {
  // Rewrite urls.
  Array.from(doc.querySelectorAll('a')).map(a => a.href.replace('https://hackage.haskell.com/', '/'));

  // Highlight code blocks
  hljs.configure({languages: ['haskell']});
  Array.from(doc.querySelectorAll('pre')).map(pre => hljs.highlightElement(pre));
  Array.from(doc.querySelectorAll('code')).map(pre => hljs.highlightElement(pre));
}

type PackageProps = {
  id?: string
}

type Package = {
  name: string,
  shortDescription: string,
  longDescriptionHtml: string
}

const Package = (props: PackageProps) => {
  const [rawHtml, setRawHtml] = useState<string | undefined>();
  const [pkg, setPkg] = useState<Package | undefined>();

  useEffect(() => {
    (async () => {
      if (!props.id) {
        return;
      }

      let html = '';
      try {
        html = await (await axios(`/api/hackage/package/${encodeURIComponent(props.id)}`)).data;
      } catch (err) {
        console.log(err);
      }
      setRawHtml(html);

      const domParser = new DOMParser();
      const doc = domParser.parseFromString(html, 'text/html');
      monkeyPatchDocument(doc);

      const docContent = doc.getElementById('content');

      const name = docContent?.querySelector('h1 a')?.innerHTML || '';
      const shortDescription = docContent?.querySelector('h1 small')?.innerHTML || '';
      const longDescriptionHtml = docContent?.querySelector('#description')?.innerHTML
        .replace(`<hr>
    [<a href="#readme">Skip to Readme</a>]`, '') || '';

      setPkg({
        name,
        longDescriptionHtml,
        shortDescription
      });
    })()

  }, [props.id]);

  console.log('pkg', pkg);
  return (
    <div>
      <GlobalMenu {...defaultMenuProps} />
      {pkg && (
        <div className={s.package}>
          <div className={s.content}>
            <div className={s.briefInfo}>
              <div className={s.packageName}>{pkg.name}</div>
              <div className={s.shortDescription}>{pkg.shortDescription}</div>
              <div className={s.longDescription} dangerouslySetInnerHTML={{ __html: pkg.longDescriptionHtml }}></div>
            </div>
          </div>
        </div>
      )}
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