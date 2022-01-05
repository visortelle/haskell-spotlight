import { useContext } from "react";
import AppContext from "../AppContext";
import s from './RecentSearches.module.css';
import Fuse from 'fuse.js'

type RecentSearchesProps = {
  query: string,
  onSelect: (query: string) => void
}

const RecentSearches = (props: RecentSearchesProps) => {
  const appContext = useContext(AppContext);
  const searchHistory = appContext.readSearchHistory();
  const showHistory = searchHistory.length > 0;
  console.log('query', props.query);

  const fuse = new Fuse(searchHistory);
  const withFilter = props.query.length === 0 ? searchHistory : fuse.search(props.query).map(item => item.item);

  return (
    <div className={s.searchResults}>
      {!showHistory && (
        <div className={s.empty}>
          Search history is empty.
        </div>
      )}
      {showHistory && (
        <div className={s.searchResultsHeader}>Filter recent successful searches {withFilter.length} / {searchHistory.length}</div>
      )}
      {showHistory && withFilter.map(historyEntry => {
        return (
          <div key={historyEntry} className={s.searchResult} onClick={() => props.onSelect(historyEntry)}>
            {historyEntry}
          </div>
        );
      })}
    </div>
  )
}

export default RecentSearches;
