import { NextPage, GetStaticPropsResult, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import PackagePage from '../../components/pages/package/PackagePage';
import { PackageProps, Version, Versions, PreferredVersions, License, Homepage } from '../../components/pages/package/common';
import axios from 'axios';
import hljs from 'highlight.js';
import cheerio, { CheerioAPI } from 'cheerio';
import unescape from 'lodash/unescape';

const Page: NextPage<PackageProps> = (props) => {
  return (
    <>
      <Head>
        <title>{props.id} - Hackage: The Haskell community’s package registry</title>
        <meta name="description" content={props.shortDescription || props.name}></meta>
      </Head>

      <PackagePage {...props} />
    </>
  );
}

export async function getStaticProps(props: GetStaticPropsContext): Promise<GetStaticPropsResult<PackageProps>> {
  const packageId = props.params!.packageId as string;

  let html = '';
  try {
    html = await getPackageRawHtml(packageId);
  } catch (err) {
    console.log(err);
  }

  const $ = cheerio.load(html);
  monkeyPatchDocument($);
  const docContent = $('#content');

  const name = $('h1 a', docContent).html()?.trim() || '';
  const shortDescription = $('h1 small', docContent).html()?.trim() || null;
  const longDescriptionHtml = $('#description').html()?.trim() || null;
  const versions = await getVersions(name, $);

  return {
    props: {
      id: packageId,
      name,
      versions,
      license: getLicense($),
      homepage: getHomepage($),
      repositoryUrl: getRepositoryUrl($),
      bugReportsUrl: getBugReports($),
      updatedAt: getUpdatedAt($),
      shortDescription,
      longDescriptionHtml
    },
    revalidate: 60
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
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

async function getPackageRawHtml(packageId: string): Promise<string> {
  let html: string = '';

  try {
    html = await (await axios(`https://hackage.haskell.org/package/${encodeURIComponent(packageId)}`)).data;
  } catch (err) {
    console.log(err);
  }

  return html;
}

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
    [<a href="#readme">Skip to Readme</a>]`, '').trim();
  description.html(newDescriptionHtml);
}

async function getVersions(packageName: string, $: CheerioAPI): Promise<Versions> {
  const propertiesElement = $('#properties').get(0);
  const tableTd = $(`th:contains('Version') + td`, propertiesElement).get(0);
  const current = $(`strong`, tableTd).text().trim();
  const availableVersions = $('*', tableTd).map((_, el) => $(el).text().trim()).toArray();

  let preferred: PreferredVersions = { normal: [], unpreferred: [], deprecated: [] };
  let available: Version[] = [];

  try {
    const preferredData = await (await axios.get(`https://hackage.haskell.org/package/${packageName}`, { headers: { accept: 'application/json' } })).data;
    preferred = {
      normal: preferredData.normal || [],
      unpreferred: preferredData.unpreferred || [],
      deprecated: preferredData.deprecated || []
    }

    // XXX - it's terrible for performance, but probably ok for demo.
    const _available = await (await Promise.allSettled(availableVersions.map((id) => getVersion(packageName, id))));
    available = _available.filter(v => v.status === 'fulfilled').map(v => (v as any).value);
  } catch (err) {
    console.log(err);
  } finally {
    return { current, available, preferred: preferred };
  }
}

async function getVersion(packageName: string, version: string): Promise<Version> {
  let html = '';
  try {
    html = await getPackageRawHtml(`${packageName}-${version}`);
  } catch (err) {
    console.log(err);
  }

  const $ = cheerio.load(html);
  const propertiesElement = $('#properties').get(0);
  const releasedTd = $(`th:contains('Uploaded') + td`, propertiesElement).get(0);

  return {
    id: version,
    license: { name: 'license_name', url: '#' },
    releasedAt: new Date().toISOString(),
    releasedBy: 'releaser'
  }
}

function getLicense($: CheerioAPI): License | null {
  const propertiesElement = $('#properties').get(0);
  const tableTd = $(`th:contains('License') + td`, propertiesElement).get(0);

  if (!tableTd) {
    return null;
  }

  const licenseEl = $(`> *`, tableTd);
  return { name: licenseEl.text(), url: licenseEl.attr('href') || null };
}

function getHomepage($: CheerioAPI): Homepage | null {
  const propertiesElement = $('#properties').get(0);
  const tableTd = $(`th:contains('Home page') + td`, propertiesElement).get(0);

  if (!tableTd) {
    return null;
  }

  const homepageLink = $(`a`, tableTd);
  return {
    text: homepageLink.text().trim(),
    url: homepageLink.attr('href')?.trim() || '#'
  };
}

function getRepositoryUrl($: CheerioAPI): string | null {
  const propertiesElement = $('#properties').get(0);
  const tableTd = $(`th:contains('Source') + td`, propertiesElement).get(0);

  if (!tableTd) {
    return null;
  }

  const repositoryLink = $(`a`, tableTd);
  return repositoryLink.attr('href')?.trim() || null;
}

function getBugReports($: CheerioAPI): string | null {
  const propertiesElement = $('#properties').get(0);
  const tableTd = $(`th:contains('Bug') + td`, propertiesElement).get(0);

  if (!tableTd) {
    return null;
  }

  const repositoryLink = $(`a`, tableTd);
  return repositoryLink.attr('href')?.trim() || null;
}

function getUpdatedAt($: CheerioAPI): string | null {
  const propertiesElement = $('#properties').get(0);
  const tableTd = $(`th:contains('Uploaded') + td`, propertiesElement).get(0);

  if (!tableTd) {
    return null;
  }

  return $(tableTd).text().replace(/^by .* at /, '').trim();
}

export default Page;
