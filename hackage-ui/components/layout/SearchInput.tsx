import axios from 'axios';
import { RefObject, useEffect, useState, useCallback, useRef } from "react";
import Input from "../forms/Input";
import s from './SearchInput.module.css';
import { useThrottle } from 'react-use';

type SearchResultsProps = {
  query: string
}

type Package = {
  name: string
}

const SearchResults = (props: SearchResultsProps) => {
  const [pkgs, setPkgs] = useState<Package[]>([]);
  const query = useThrottle(props.query, 500);

  useEffect(() => {
    (async () => {
      if (!query) {
        return;
      }

      let terms = query.split(' ').join('+');

      const res = await (await axios.get(
        `/api/hackage/packages/search?terms=${encodeURIComponent(terms)}`,
        { headers: { 'Content-Type': 'application/json' } }
      )).data;

      setPkgs(res);
    })()
  }, [query]);

  return (
    <div className={s.searchResultsContainer}>
      <div className={s.searchResults}>
        {!query && (
          <div className={s.help}>
            <h3 className={s.helpHeader}>Examples</h3>
            <p><code>servant</code> to search a package in Hackage.</p>
            <p><code>:t a -&gt; a</code> to search in Hoogle.</p>
          </div>
        )}
        {query && pkgs.map(pkg => {
          return (
            <a key={pkg.name} className={s.searchResult} href={`https://hackage.haskell.org/packages/${pkg.name}`}>
              {pkg.name}
            </a>
          );
        })}
      </div>
    </div>
  );
}

const SearchInput = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [focusedTimes, setFocusedTimes] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [inputRef, setInputRef] = useState<RefObject<HTMLInputElement>>();

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key !== 's') {
      return;
    }

    if (!isFocused && inputRef) {
      inputRef.current?.focus();
    }
  }, [isFocused, inputRef]);

  useEffect(() => {
    window.addEventListener('mousedown', (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    });
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsFocused(false);
      }
    });
  }, [ref]);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyUp]);

  const showSearchResults =
    isFocused &&
    (isDirty || focusedTimes > 1); // don't show search results after page load

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
        placeholder='Click or type "s" to search...'
        value={query}
        focusOnMount
      />
      {showSearchResults && <SearchResults query={query} />}
    </div>
  );
}
export default SearchInput;
