import axios from 'axios';
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from '../AppContext/AppContext';
import { A, ExtA } from '../A/A';
import s from './HackageSearchResults.module.css';
import Header from './Header';
import NothingFound from './NothingFound';

export type HackageSearchResult = { name: string };
export type HackageSearchResults = HackageSearchResult[];

export type HackageSearchResultsProps = {
  query: string,
  apiUrl: string,
  asEmbeddedWidget?: boolean
};

const HackageSearchResults = ({ query, apiUrl, asEmbeddedWidget }: HackageSearchResultsProps) => {
  const appContext = useContext(AppContext);
  const [searchResults, setSearchResults] = useState<HackageSearchResults>([]);

  useEffect(() => {
    (async () => {
      if (!query) {
        return;
      }

      let searchTerms = query.split(' ').join('+');

      let resData: { name: string }[] = [];

      const taskId = 'hackage-search';
      try {
        appContext.startTask(taskId, `search on Hackage: ${query}`);

        resData = await (await axios.get(
          `${apiUrl}/packages/search?terms=${encodeURIComponent(searchTerms)}`,
          { headers: { 'Content-Type': 'application/json' } }
        )).data;
      } catch (err) {
        appContext.notifyError(`An error occurred while searching for packages`);
        console.log(err);
      } finally {
        appContext.finishTask(taskId);
      }

      const searchResults: HackageSearchResults = resData;

      if (searchResults.length > 0) {
        appContext.writeSearchHistoryEntry(`:p ${query}`);
      }

      setSearchResults(searchResults);
    })()

    // XXX - don't add appContext to deps here as eslint suggests.
    // It may cause infinite recursive calls. Fix it if you know how.
  }, [query, appContext.tasks.length]);

  const Link = asEmbeddedWidget ? ExtA : A;
  return (
    <div className={s.searchResults}>
      {searchResults.length === 0 && (
        <NothingFound waitBeforeShow={1500}>No packages found. Try another query.</NothingFound>
      )}
      {searchResults.length > 0 && (
        <Header>Packages found: {searchResults.length}</Header>
      )}
      <div className={s.searchResultsContainer}>
        {searchResults.map(pkg => {
          return (
            <Link
              key={pkg.name}
              className={s.searchResult}
              target={asEmbeddedWidget ? '__blank' : '_self'}
              href={asEmbeddedWidget ? `https://hackage.haskell.org/package/${pkg.name}` : `/package/${pkg.name}`}
              analytics={{ featureName: 'HackageSearchResult', eventParams: {} }}
            >
              {pkg.name}
            </Link>
          );
        })}
      </div>
    </div>
  )
}

export default HackageSearchResults;
