import GlobalMenu, { defaultMenuProps } from "../layout/GlobalMenu";
import axios from 'axios';
import { useState, useEffect } from "react";
import Footer from "../layout/Footer";
import s from './Package.module.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/a11y-dark.css';
import escape from 'lodash/escape';
import unescape from 'lodash/unescape';

// XXX - We can get rid of most content of this function after the hackage-server will implement missing APIs.
function monkeyPatchDocument(doc: Document): void {
  // Rewrite urls.
  Array.from(doc.querySelectorAll('a')).map(a => a.href.replace('https://hackage.haskell.com/', '/'));

  // Highlight code blocks
  [
    ...Array.from(doc.querySelectorAll('code')),
    ...Array.from(doc.querySelectorAll('pre'))
  ].map(el => {
    /* Prevent HTML/JS injections.
    https://github.com/highlightjs/highlight.js/issues/2886 */
    el.innerHTML = escape(el.innerHTML);

    hljs.configure({ languages: ['haskell'] })
    hljs.highlightElement(el);

    el.innerHTML = unescape(el.innerHTML);
  });

  // Remove "Skip to Readme" links.
  const description = doc.getElementById('content')?.querySelector('#description') as Element;
  description.innerHTML = description.innerHTML.replace(`<hr>
    [<a href="#readme">Skip to Readme</a>]`, '');
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

      const name = docContent?.querySelector('h1 a')?.innerHTML.trim() || '';
      const shortDescription = docContent?.querySelector('h1 small')?.innerHTML.trim() || '';
      const longDescriptionHtml = docContent?.querySelector('#description')?.innerHTML.trim() || '';
      setPkg({
        name,
        longDescriptionHtml,
        shortDescription
      });
    })()

  }, [props.id]);

  return (
    <div className={s.page}>
      <GlobalMenu {...defaultMenuProps} />
      {pkg && (
        <div className={s.package}>
          <div className={s.content}>
            <div className={s.briefInfo}>
              <div className={s.packageName}><small>📦</small>&nbsp;<h1 className={s.packageNameH1}>{pkg.name}</h1></div>
              {pkg.shortDescription && <div className={s.shortDescription}>{pkg.shortDescription}</div>}
              {pkg.longDescriptionHtml && <div className={s.longDescription} dangerouslySetInnerHTML={{ __html: pkg.longDescriptionHtml }}></div>}
            </div>
          </div>
        </div>
      )}
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
