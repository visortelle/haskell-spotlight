import axios from 'axios';
import { RefObject, useEffect, useState, useCallback, useRef } from "react";
import Input from "../forms/Input";
import s from './SearchInput.module.css';
import { useThrottle } from 'react-use';
import groupBy from 'lodash/groupBy';
import { useRouter } from 'next/router';
import A from './A';

const HackageSearchResults = ({ query }: { query: string }) => {
  const [searchResults, setSearchResults] = useState<{ name: string }[]>([]);

  useEffect(() => {
    (async () => {
      if (!query) {
        return;
      }

      let searchTerms = query.split(' ').join('+');

      let resData: { name: string }[] = [];

      try {
        resData = await (await axios.get(
          `/api/hackage/packages/search?terms=${encodeURIComponent(searchTerms)}`,
          { headers: { 'Content-Type': 'application/json' } }
        )).data;
      } catch (err) {
        console.log(err);
      }
      setSearchResults(resData);
    })()
  }, [query]);

  return (
    <div className={s.hackageSearchResults}>
      {searchResults.map(pkg => {
        return (
          <A key={pkg.name} className={s.searchResult} href={`/package/${pkg.name}`}>
            {pkg.name}
          </A>
        );
      })}
    </div>
  )
}

// Example:
// docs: "O(n) map f xs is the ByteString obtained by\napplying f to each element of xs\n"
// item: "map :: (Char -> Char) -> ByteString -> ByteString"
// module: { name: 'Data.ByteString.Lazy.Char8', url: 'https://hackage.haskell.org/package/bytestring/docs/Data-ByteString-Lazy-Char8.html' }
// package: { name: 'bytestring', url: 'https://hackage.haskell.org/package/bytestring' }
// type: ""
// url: "https://hackage.haskell.org/package/bytestring/docs/Data-ByteString-Lazy-Char8.html#v:map"
type HoogleItemEntry = {
  docs: string,
  item: string,
  module: { name: string, url: string },
  package: { name: string, url: string },
  type: string,
  url: string
}
type HoogleItemKey = string;
const HoogleSearchResults = ({ query }: { query: string }) => {
  // Hoogle sometimes returns duplicate entries. Maybe a Hoogle bug, maybe I missed something.
  function deduplicate(arr: any[]) {
    return Array.from(new Set(arr.map(el => JSON.stringify(el)))).map(el => JSON.parse(el));
  }
  function rewriteUrl(url: string): string {
    if (!url) {
      return '#';
    }
    return url.replace('https://hackage.haskell.org/', '/');
  }

  const [searchResults, setSearchResults] = useState<Record<HoogleItemKey, HoogleItemEntry[]>>({});

  useEffect(() => {
    (async () => {
      if (!query) {
        return;
      }

      let resData = [];

      try {
        resData = await (await axios.get(
          `/api/hoogle?mode=json&format=text&hoogle=${encodeURIComponent(query)}&start=1&count=1000`,
          { headers: { 'Content-Type': 'application/json' } }
        )).data;
      } catch (err) {
        console.log(err);
      }

      setSearchResults(groupBy(deduplicate(resData), 'item'));
    })()
  }, [query]);

  return (
    <div className={s.hoogleSearchResults}>
      {Object.keys(searchResults).map(hoogleItemKey => {
        const hoogleItem = searchResults[hoogleItemKey];
        const [typeName, ..._typeDef] = hoogleItemKey.split(' :: ');
        const typeDef = _typeDef.join('');
        const pkgs = groupBy(hoogleItem, 'package.name');

        const docs = hoogleItem[0].docs
          .replace(/\n+/g, '\n').trim(); // Apply minimal formatting to make docs look more consistent.

        const tweetSize = 140;

        return (
          <div key={hoogleItemKey} className={s.hoogleSearchResult}>
            <A href={rewriteUrl(hoogleItem[0].url)} className={`${s.hoogleItemLink} ${s.link}`}>
              <>
                <strong className={s.hoogleItemTypeName}>{typeName}</strong>{typeDef ? <strong>&nbsp;::&nbsp;</strong> : ''}<span>{typeDef}</span>
              </>
            </A>
            <div className={s.hoogleItemContent}>
              {docs && (
                <div className={s.hoogleItemDocs}>
                  {docs.slice(0, tweetSize)}
                  {docs.length > tweetSize && <>…</>}
                </div>
              )}
              {pkgs[Object.keys(pkgs)[0]][0].package.name && <div className={s.hoogleItemPackages}>
                {Object.keys(pkgs).map(packageKey => {
                  const pkg = pkgs[packageKey];

                  return (
                    <div key={packageKey} className={s.hoogleItemPackage}>
                      <A href={rewriteUrl(pkg[0].package.url)} className={s.link}><small style={{ marginRight: '0.5em' }}>📦</small>{pkg[0].package.name}</A>
                      <div className={s.hoogleItemModules}>
                        {pkg.map(item => (
                          <A key={item.module.name} href={rewriteUrl(item.module.url)} className={s.link}>{item.module.name}</A>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>}
            </div>
          </div>
        );
      })}
    </div>
  )
}

type SearchResultsProps = {
  query: string
}

const SearchResults = (props: SearchResultsProps) => {
  const query = useThrottle(props.query, 300);
  const queryType: 'hackage' | 'hoogle' = query?.match(/^\:t .*$/g) ? 'hoogle' : 'hackage';

  return (
    <div className={s.searchResultsContainer}>
      <div className={s.searchResults}>
        {!query && (
          <div className={s.help}>
            <h3 className={s.helpHeader}>Search Examples</h3>
            <p><code className="hljs">servant</code> to search for packages in Hackage.</p>
            <p><code className="hljs">:t a -&gt; a</code> to search for types in Hoogle.</p>
          </div>
        )}
        {query && queryType === 'hackage' && <HackageSearchResults query={query.trim()} />}
        {query && queryType === 'hoogle' && <HoogleSearchResults query={query.replace(/^\:t /, '').trim()} />}
      </div>
    </div>
  );
}

const SearchInput = () => {
  const router = useRouter();
  const [query, _setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [focusedTimes, setFocusedTimes] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [inputRef, setInputRef] = useState<RefObject<HTMLInputElement>>();

  const setQuery = useCallback((query: string) => {
    router.replace({ query: { ...router.query, search: query } });
    _setQuery(query);
  }, [router]);

  useEffect(() => {
    if (!isDirty && router.query?.search !== query) {
      _setQuery(router.query.search as string || '');
    }
  }, [query, isDirty, setQuery, router.query.search]);


  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node) && event.key === 'Tab') {
      setIsFocused(false);
      return;
    }

    if (event.key !== '/') {
      return;
    }

    if (!isFocused) {
      inputRef?.current?.focus();
    }
  }, [isFocused, inputRef]);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsFocused(false);
    }
  }, [ref]);

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleKeyUp, handleMouseDown]);

  const showSearchResults =
    (isFocused && query?.length) ||
    (isFocused && (isDirty || focusedTimes > 1)); // don't show search results after page load

  return (
    <div className={s.searchInput} ref={ref}>
      <Input
        onChange={(v) => {
          setIsDirty(true);
          setQuery(v)
        }}
        onFocus={() => {
          setFocusedTimes(focusedTimes + 1);
          setIsFocused(true);
        }}
        onInputRef={setInputRef}
        placeholder='Click or press "/" to search...'
        value={query}
        focusOnMount
      />
      {showSearchResults && <SearchResults query={query} />}
    </div>
  );
}
export default SearchInput;
