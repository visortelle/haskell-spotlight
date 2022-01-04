import { NextPage, GetStaticPropsResult, GetStaticPropsContext } from 'next';
import PackagePage, { PackageProps, Versions, License } from '../../components/pages/Package';
import axios from 'axios';
import hljs from 'highlight.js';
import 'highlight.js/styles/a11y-dark.css';
import cheerio, { CheerioAPI } from 'cheerio';
import unescape from 'lodash/unescape';


const Page: NextPage<PackageProps> = (props) => {
  return (
    <PackagePage {...props} />
  );
}

export async function getStaticProps(props: GetStaticPropsContext): Promise<GetStaticPropsResult<PackageProps>> {
  const packageId = props.params!.packageId as string;

  let html = '';
  try {
    html = await (await axios(`https://hackage.haskell.org/package/${encodeURIComponent(packageId)}`)).data;
  } catch (err) {
    console.log(err);
  }

  const $ = cheerio.load(html);
  monkeyPatchDocument($);
  const docContent = $('#content');

  const name = $('h1 a', docContent).html()?.trim() || '';
  const shortDescription = $('h1 small', docContent).html()?.trim();
  const longDescriptionHtml = $('#description').html()?.trim();

  const versions = getVersions($);
  const license = getLicense($);

  return {
    props: {
      id: packageId,
      name,
      versions,
      license,
      shortDescription,
      longDescriptionHtml
    },
    revalidate: 10
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

// highlight.js often recognize Haskell code as Erlang, OCaml and others.
// We decided to specify subset of popular languages here excluding from ML family.
// If you want to modify the list or know a better solution, please raise an issue or pull request at our issue tracker.
// Full list here https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md
const languagesToHighlight = [
  'Haskell',
  'Shell',
  'Bash',
  'Diff',
  'JSON',
  'LaTeX',
  'Protocol Buffers',
  'TOML',
  'XML',
  'YAML',
  'Nix'
];

// XXX - We can get rid of most content of this function after the hackage-server will implement missing APIs.
function monkeyPatchDocument($: CheerioAPI): void {
  // Rewrite urls.
  $('a').map((_, a) => {
    $(a).attr('href', $(a).attr('href')?.replace('https://hackage.haskell.org/package/', '/package/') || '#')
  });

  // Highlight code blocks
  $('code, pre').map((_, el) => {
    /* Ignore blocks containing other HTML elements:
    <code><a href="http://hackage.haskell.org/package/array">array</a></code>
    */
    if ($(el).children().length) {
      return el;
    }


    const highlightedHtml = hljs.highlightAuto(unescape($(el).html() as string), languagesToHighlight).value;
    $(el).html(highlightedHtml);
    $(el).addClass('hljs');
  });

  // Remove "Skip to Readme" links.
  const description = $('#content #description');
  const newDescriptionHtml = (description.html() || '').replace(`<hr>
    [<a href="#readme">Skip to Readme</a>]`, '');
  description.html(newDescriptionHtml);
}

function getVersions($: CheerioAPI): Versions {
  const propertiesElement = $('#properties').get(0);
  const tableTd = $(`th:contains('Version') + td`, propertiesElement).get(0);
  const current = $(`strong`, tableTd).text();
  const available = $('*', tableTd).map((_, el) => $(el).text()).toArray();
  return { current, available };
}

function getLicense($: CheerioAPI): License | undefined {
  const propertiesElement = $('#properties').get(0);
  const tableTd = $(`th:contains('License') + td`, propertiesElement).get(0);
  const licenseEl = $(`> *`, tableTd);
  return { name: licenseEl.text(), url: licenseEl.attr('href') };
}


export default Page;
