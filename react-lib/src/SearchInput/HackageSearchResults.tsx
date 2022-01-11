import axios from 'axios';
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from '../AppContext/AppContext';
import { A } from '../A/A';
import s from './HackageSearchResults.module.css';
import Header from './Header';
import NothingFound from './NothingFound';

export type HackageSearchResults = { name: string }[];

const HackageSearchResults = ({ query, apiUrl }: { query: string, apiUrl: string }) => {
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
        appContext.notifyError('An error occured during searching on Hackage');
        console.log(err);
      } finally {
        appContext.finishTask(taskId);
      }

      const searchResults: HackageSearchResults = resData;

      if (searchResults.length > 0) {
        appContext.writeSearchHistoryEntry(query);
      }

      setSearchResults(searchResults);
    })()

    // XXX - don't add appContext to deps here as eslint suggests.
    // It may cause infinite recursive calls. Fix it if you know how.
  }, [query, appContext.tasks.length]);

  return (
    <div className={s.searchResults}>
      {searchResults.length === 0 && (
        <NothingFound waitBeforeShow={1500}>Nothing found in Hackage. Try another query.</NothingFound>
      )}
      {searchResults.length > 0 && (
        <Header>Found on Hackage: {searchResults.length}</Header>
      )}
      <div className={s.searchResultsContainer}>
        {searchResults.map(pkg => {
          return (
            <A
              key={pkg.name}
              className={s.searchResult}
              href={`/package/${pkg.name}`}
              analytics={{ featureName: 'HackageSearchResult', eventParams: {} }}
            >
              {pkg.name}
            </A>
          );
        })}
      </div>
    </div>
  )
}

export default HackageSearchResults;
