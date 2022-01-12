import React, { RefObject, useEffect, useState, useCallback, useContext, useRef } from "react";
import { AppContext } from "../AppContext/AppContext";
import Input from "./Input";
import s from './SearchInput.module.css';
import { useDebounce } from 'use-debounce';
import { NextRouter } from 'next/router';
import HackageSearchResults from './HackageSearchResults';
import HoogleSearchResults from './HoogleSearchResults';
import RecentSearches from './RecentSearches';

export const SearchResultsClassName = `Haskell-8f731b8c-7900-4d8b`; // Whatever.

type Api = {
  hackageApiUrl: string,
  hoogleApiUrl: string
}

type SearchResultsProps = {
  query: string,
  setQuery: (query: string) => void,
  api: Api,
  asEmbeddedWidget?: boolean
}

const SearchResults = (props: SearchResultsProps) => {
  const appContext = useContext(AppContext);
  const [query] = useDebounce(props.query, 300);

  useEffect(() => {
    if (query.length === 0) {
      return;
    }

    appContext.analytics?.gtag('event', 'search', {
      search_term: query,
    });
  }, [query]);

  let queryType: 'hackage' | 'hoogle' | 'recentSearches' | 'allRecentSearches' | 'showHelp' | 'unknown' = 'unknown';

  if (query.startsWith(':')) {
    if (query?.match(/^\:t .*$/g)) {
      queryType = 'hoogle';
    } else if (query?.match(/^\:r .*$/g)) {
      queryType = 'recentSearches';
    } else if (query?.match(/^\:r$/g)) {
      queryType = 'allRecentSearches';
    } else if (query?.match(/^\:$/g)) {
      queryType = 'showHelp';
    };
  } else {
    if (query.length === 0) {
      queryType = 'showHelp';
    } else {
      queryType = 'hackage';
    }
  }

  return (
    <div className={`${s.searchResultsContainer} ${SearchResultsClassName}`}>
      <div className={s.searchResults}>
        {queryType === 'showHelp' && (<Help />)}
        {query && queryType === 'hackage' && (
          <HackageSearchResults
            query={query.trim()}
            apiUrl={props.api.hackageApiUrl}
            asEmbeddedWidget={props.asEmbeddedWidget}
          />
        )}
        {query && queryType === 'hoogle' && <HoogleSearchResults query={query.replace(/^\:t /, '').trim()} apiUrl={props.api.hoogleApiUrl} />}
        {query && queryType === 'recentSearches' && <RecentSearches query={query.replace(/^\:r ?/, '').trim()} onSelect={props.setQuery} />}
        {query && queryType === 'allRecentSearches' && <RecentSearches query={''} onSelect={props.setQuery} />}
      </div>
    </div>
  );
}

export type SearchInputProps = { router?: NextRouter, api: Api, asEmbeddedWidget?: boolean };

export const SearchInput = (props: SearchInputProps) => {
  const { router } = props;
  const [query, _setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [focusedTimes, setFocusedTimes] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [inputRef, setInputRef] = useState<RefObject<HTMLInputElement>>();

  const setQuery = useCallback((query: string) => {
    router?.replace({ query: { ...router.query, search: query } }, undefined, { shallow: true });
    _setQuery(query);
  }, [router]);

  useEffect(() => {
    if (router && !isDirty && router.query?.search !== query) {
      _setQuery(router.query.search as string || '');
    }
  }, [query, isDirty, setQuery, router?.query.search]);

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
    if (props.asEmbeddedWidget) {
      return;
    }

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
    props.asEmbeddedWidget ||
    Boolean((isFocused && query?.length) ||
      (isFocused && (isDirty || focusedTimes > 1))); // don't show search results after page load

  let placeholder = ':t a -> b';
  if (!props.asEmbeddedWidget) {
    placeholder = (isFocused && !isDirty && !showSearchResults) ? `Type ":" to show help` : `Click or press "/" to search…`
  }

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
        placeholder={placeholder}
        value={query}
        focusOnMount
      />
      {showSearchResults && <SearchResults query={query} setQuery={setQuery} api={props.api} asEmbeddedWidget={props.asEmbeddedWidget} />}
    </div>
  );
}

const Help = () => {
  const appContext = useContext(AppContext);
  useEffect(() => {
    appContext.analytics?.gtag('event', 'FeatureUsed', { event_label: 'SearchInputHelpPopup' });
  }, []);

  return (
    <div className={s.help}>
      <h3 className={s.helpHeader}>Search Examples</h3>
      <p><code className="hljs">servant</code> to search for packages in Hackage.</p>
      <p><code className="hljs">:t a -&gt; a</code> to search by type signature or function name in Hoogle.</p>
      <p><code className="hljs">:r smth</code> to show your recent searches.</p>
    </div>
  );
}
