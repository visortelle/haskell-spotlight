import { useContext, useState } from "react";
import AppContext from "../AppContext";
import s from './RecentSearches.module.css';
import Fuse from 'fuse.js'
import SVGIcon from '../icons/SVGIcon';
import clearIcon from '!!raw-loader!../icons/clear.svg';
import Header from './Header';
import HeaderButton from './HeaderButton';
import NothingFound from './NothingFound';

type RecentSearchesProps = {
  query: string,
  onSelect: (query: string) => void
}

const RecentSearches = (props: RecentSearchesProps) => {
  const appContext = useContext(AppContext);
  const searchHistory = appContext.readSearchHistory();
  const showHistory = searchHistory.length > 0;
  const [_, forceUpdate] = useState({});

  const fuse = new Fuse(searchHistory);
  const withFilter = props.query.length === 0 ? searchHistory : fuse.search(props.query).map(item => item.item);

  return (
    <div className={s.searchResults}>
      {!showHistory && (
        <NothingFound waitBeforeShow={0}>
          Search history is empty.
        </NothingFound>
      )}
      {showHistory && (
        <Header>
          <div>Found in recent searches: {withFilter.length} / {searchHistory.length}</div>
          <HeaderButton
            text="Delete All"
            svgIcon={clearIcon}
            onClick={(e) => {
              e.stopPropagation();
              appContext.purgeSearchHistory();
              forceUpdate({});
            }}
          />
        </Header>
      )}
      {showHistory && withFilter.map(historyEntry => {
        return (
          <div key={historyEntry} className={s.searchResult} onClick={() => props.onSelect(historyEntry)}>
            <div className={s.historyEntry}>{historyEntry}</div>
            <div
              className={s.removeSearchHistoryEntry}
              title="Delete search history entry"
              onClick={(e) => {
                e.stopPropagation();
                appContext.removeSearchHistoryEntry(historyEntry);
                forceUpdate({});
              }}
            >
              <SVGIcon svg={clearIcon} />
            </div>
          </div>
        );
      })}
    </div>
  )
}

export default RecentSearches;
