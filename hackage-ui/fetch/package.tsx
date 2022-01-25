import axios, { AxiosError } from 'axios';
import hljs from 'highlight.js';
import { License, Homepage, Versions, Dependency, Dependencies, ReverseDependency, DependencyCondition } from '../components/pages/package/common';
import cheerio, { CheerioAPI, BasicAcceptedElems } from 'cheerio';
import unescape from 'lodash/unescape';

export type Package = {
  id: string,
  name: string,
  versions: Versions | null,
  currentVersion: string | null,
  versionsCount: number,
  shortDescription: string | null,
  longDescriptionHtml: string | null,
  license: License | null,
  homepageUrl: Homepage | null,
  repositoryUrl: string | null,
  bugReportsUrl: string | null,
  updatedAt: string | null,
  reverseDependencies: ReverseDependency[] | null,
  dependencies: Dependencies | null
}

export async function getPackage(packageId: string): Promise<null | Package> {
  let html = '';
  try {
    html = await getPackageRawHtml(packageId);
  } catch (err) {
    console.log(err);
  }

  if (html === '') {
    return null;
  }

  const $ = cheerio.load(html);
  monkeyPatchDocument($);

  const docContent = $('#content');

  const name = $('h1 a', docContent).html()?.trim() || '';
  const shortDescription = $('h1 small', docContent).html()?.trim() || null;
  const longDescriptionHtml = $('#description').html()?.trim() || null;

  // XXX - take care on the order of arguments here... Or implement a better solution.
  const [
    versions,
    dependencies,
    reverseDependencies
  ] = await (await Promise.allSettled([
    await getVersions(name),
    await getDependencies(packageId),
    await getReverseDependencies(name),
  ])).map((res) => (res as any).value) as [
      Versions,
      Dependencies,
      ReverseDependency[]
    ];

  const versionsCount = Array.from(new Set([
    ...versions.normal,
    ...versions.unpreferred,
    ...versions.deprecated,
  ])).length;

  return {
    id: packageId,
    name,
    currentVersion: getCurrentVersion($),
    versions,
    versionsCount,
    bugReportsUrl: getBugReportsUrl($),
    homepageUrl: getHomepageUrl($),
    license: getLicense($),
    shortDescription,
    longDescriptionHtml,
    repositoryUrl: getRepositoryUrl($),
    updatedAt: getUpdatedAt($),
    reverseDependencies,
    dependencies
  }
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

export async function getPackageRawHtml(packageId: string): Promise<string> {
  let html: string = '';

  try {
    html = await (await axios(`https://hackage.haskell.org/package/${encodeURIComponent(packageId)}`)).data;
  } catch (err) {
    if (!(axios.isAxiosError(err) && err.response?.status === 404)) {
      console.log(err);
    }
  }

  return html;
}

// XXX - We can get rid of most content of this function after the hackage-server will implement missing APIs.
export function monkeyPatchDocument($: CheerioAPI): void {
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

export function getCurrentVersion($: CheerioAPI): string | null {
  const propertiesElement = $('#properties').get(0);
  const tableTd = $(`th:contains('Version') + td`, propertiesElement).get(0);

  if (!tableTd) {
    return null;
  }

  return $(`strong`, tableTd).text().trim();
}

export function getLicense($: CheerioAPI): License | null {
  const propertiesElement = $('#properties').get(0);
  const tableTd = $(`th:contains('License') + td`, propertiesElement).get(0);

  if (!tableTd) {
    return null;
  }

  const licenseEl = $(`> *`, tableTd);
  return { name: $(tableTd).text(), url: licenseEl.attr('href') || null };
}

export function getHomepageUrl($: CheerioAPI): Homepage | null {
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

export function getRepositoryUrl($: CheerioAPI): string | null {
  const propertiesElement = $('#properties').get(0);
  const tableTd = $(`th:contains('Source') + td`, propertiesElement).get(0);

  if (!tableTd) {
    return null;
  }

  const repositoryLink = $(`a`, tableTd);
  return repositoryLink.attr('href')?.trim() || null;
}

export function getBugReportsUrl($: CheerioAPI): string | null {
  const propertiesElement = $('#properties').get(0);
  const tableTd = $(`th:contains('Bug') + td`, propertiesElement).get(0);

  if (!tableTd) {
    return null;
  }

  const repositoryLink = $(`a`, tableTd);
  return repositoryLink.attr('href')?.trim() || null;
}

export function getUpdatedAt($: CheerioAPI): string | null {
  const propertiesElement = $('#properties').get(0);
  const tableTd = $(`th:contains('Uploaded') + td`, propertiesElement).get(0);

  if (!tableTd) {
    return null;
  }

  return $(tableTd).text().replace(/^by .* at /, '').trim();
}

export async function getVersions(packageName: string): Promise<Versions> {
  // ee5ad44c22b245e960ee2f8670ada3a55bbb7e16
  let versions: Versions = { normal: [], unpreferred: [], deprecated: [] };
  try {
    const data = await (await axios.get(`https://hackage.haskell.org/package/${packageName}/preferred`, { headers: { accept: 'application/json' } })).data;
    versions = {
      normal: data['normal-version'] || [],
      unpreferred: data['unpreferred-version'] || [],
      deprecated: data['deprecated-version'] || [],
    }
  } catch (err) {
    console.log(err);
  } finally {
    return versions;
  }
}

export async function getDependencies(packageId: string): Promise<Dependencies> {
  let dependencies: Dependencies = { modules: [], dependenciesCount: 0, conditionalDependenciesCount: 0 };
  let html: string = '';

  try {
    html = await (await axios(`https://hackage.haskell.org/package/${encodeURIComponent(packageId)}/dependencies`)).data;

    const $ = cheerio.load(html);

    const getDep = (li: BasicAcceptedElems<any>): Dependency => {
      const versionRangeSpecified = $(li).text().trim().match(/^.*\(.*\)$/);

      return {
        packageName: $('a', li).text().trim(),
        versionsRange: versionRangeSpecified ? $(li).text().trim().replace(/^.*\(/, '').replace(/\).*$/, '') : null
      }
    }

    const modules = $('#content table.properties > tbody > tr').toArray().map(tr => {
      return {
        name: $('th', tr).text().trim(),
        dependencies: $('> td > #detailed-dependencies > ul > li:not(:has(strong))', tr).map((_, li) => getDep(li)).toArray(),
        conditions: $('> td > #detailed-dependencies > ul > li:has(strong)', tr).map((_, li) => {
          const elements = $(li).contents();

          const ifIndex = $(elements).index($('strong:contains(if)', li));
          const elseIndex = $(elements).index($('strong:contains(else)', li));

          const predicate = $($(elements).get(ifIndex + 1)).text().trim();

          const ifBranchEl = $(elements).get(ifIndex + 2);
          const elseBranchEl = $(elements).get(elseIndex + 1);

          const ifDeps = $('> ul > li:not(:has(strong))', ifBranchEl).map((_, li) => getDep(li)).toArray();
          const elseDeps = $('> ul > li:not(:has(strong))', elseBranchEl).map((_, li) => getDep(li)).toArray();

          const condition: DependencyCondition = {
            predicate,
            ifDeps,
            elseDeps
          }

          return condition;
        }).toArray()
      }
    });

    // Probably deduplicate dependencies here?
    const conditionalDependenciesCount = modules.reduce((c, m) => c + m.conditions.reduce((mc, cm) => mc + cm.ifDeps.length + cm.elseDeps.length, 0), 0);
    const dependenciesCount = modules.reduce((c, m) => c + m.dependencies.length, 0);

    dependencies = { modules, dependenciesCount, conditionalDependenciesCount };
  } catch (err) {
    if (!axios.isAxiosError(err)) {
      console.log(err);
    }
  } finally {
    return dependencies;
  }
}


export async function getReverseDependencies(packageName: string): Promise<ReverseDependency[]> {
  let reverseDependencies: ReverseDependency[] = [];
  let html: string = '';

  try {
    html = await (await axios(`https://packdeps.haskellers.com/reverse/${encodeURIComponent(packageName)}`)).data;

    const $ = cheerio.load(html);
    reverseDependencies = $('table tbody tr').toArray().map(tr => {
      const isOutdated = $(tr).hasClass('out-of-date');
      const tds = $('td', tr);
      const td0 = $(tds).get(0);
      const td1 = $(tds).get(1);
      const packageName = $(td0).text().trim();
      const versionsRange = $(td1).text().trim();
      const hasReverseDependencies = $('a', td0).toArray().length > 0;

      return {
        isOutdated,
        packageName,
        versionsRange,
        hasReverseDependencies
      }
    });
  } catch (err) {
    if (!axios.isAxiosError(err)) {
      console.log(err);
    }
  } finally {
    return reverseDependencies;
  }
}
