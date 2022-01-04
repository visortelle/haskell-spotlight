import { NextPage, GetStaticPropsResult, GetStaticPropsContext } from 'next';
import PackagePage, { PackageProps } from '../../components/pages/Package';
import { useRouter } from 'next/router';
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
  const shortDescription = $('h1 small', docContent).html()?.trim() || '';
  const longDescriptionHtml = $('#description').html()?.trim() || '';

  return {
    props: {
      id: packageId,
      name,
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
  'Shell',
  'Bash',
  'C',
  'C#',
  'C++',
  'Clojure',
  'CSS',
  'Diff',
  'Go',
  'Groovy',
  'Haskell',
  'Java',
  'JavaScript',
  'JSON',
  'LaTeX',
  'Lisp',
  'Perl',
  'PHP',
  'Protocol Buffers',
  'Python',
  'Ruby',
  'Rust',
  'SQL',
  'TOML',
  'TypeScript',
  'XML',
  'YAML',
  'Nix'
];

// XXX - We can get rid of most content of this function after the hackage-server will implement missing APIs.
function monkeyPatchDocument($: CheerioAPI): void {
  // Rewrite urls.
  $('a').map((_, a) => {
    $(a).attr('href', $(a).attr('href')?.replace('https://hackage.haskell.com/', '/') || '#')
  });

  // Highlight code blocks
  $('code, pre').map((_, el) => {
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

export default Page;
