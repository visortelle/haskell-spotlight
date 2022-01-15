import axios from 'axios';
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from '../AppContext/AppContext';
import s from './HoogleSearchResults.module.css';
import groupBy from 'lodash/groupBy';
import { A, ExtA } from '../A/A';
import Header from './Header';
import HeaderButton from './HeaderButton';
import NothingFound from './NothingFound';
import viewNormallyIcon from '../icons/plus.svg';
import viewBrieflyIcon from '../icons/minus.svg';
import zipObject from 'lodash/zipObject';
import mapValues from 'lodash/mapValues';

// Example:
// docs: "O(n) map f xs is the ByteString obtained by\napplying f to each element of xs\n"
// item: "map :: (Char -> Char) -> ByteString -> ByteString"
// module: { name: 'Data.ByteString.Lazy.Char8', url: 'https://hackage.haskell.org/package/bytestring/docs/Data-ByteString-Lazy-Char8.html' }
// package: { name: 'bytestring', url: 'https://hackage.haskell.org/package/bytestring' }
// type: ""
// url: "https://hackage.haskell.org/package/bytestring/docs/Data-ByteString-Lazy-Char8.html#v:map"
export type HoogleItemEntry = {
  docs: string,
  item: string,
  module: { name: string, url: string },
  package: { name: string, url: string },
  type: string,
  url: string
}

export type HoogleItemKey = string;

export type HoogleSearchResults = Record<HoogleItemKey, HoogleItemEntry[]>;

export type ViewMode = 'brief' | 'normal';

export type HoogleSearchResultsProps = {
  query: string,
  apiUrl: string,
  asEmbeddedWidget?: boolean
};

const HoogleSearchResults = ({ query, apiUrl, asEmbeddedWidget }: HoogleSearchResultsProps) => {
  // Hoogle sometimes returns duplicate entries. Maybe a Hoogle bug, maybe I missed something.
  function deduplicate(arr: any[]) {
    return Array.from(new Set(arr.map(el => JSON.stringify(el)))).map(el => JSON.parse(el));
  }
  function rewriteUrl(url: string): string {
    if (!url) {
      return '#';
    }
    return url;
    // Temporary disabled.
    // return url.replace('https://hackage.haskell.org/', '/');
  }

  const appContext = useContext(AppContext);
  const [searchResults, setSearchResults] = useState<HoogleSearchResults>({});
  const [viewModes, setViewModes] = useState<Record<HoogleItemKey, ViewMode>>({});
  const [globalViewMode, setGlobalViewMode] = useState<ViewMode>('brief');

  useEffect(() => {
    setViewModes(mapValues(viewModes, () => globalViewMode));
  }, [globalViewMode, setGlobalViewMode]);

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      if (!query) {
        return;
      }

      let resData = [];

      const taskId = 'hoogle-search';
      try {
        appContext.startTask(taskId, `search on Hoogle: ${query}`);

        resData = await (await axios.get(
          `${apiUrl}?mode=json&format=text&hoogle=${encodeURIComponent(query)}&start=1&count=1000`,
          {
            headers: { 'Content-Type': 'application/json' },
            signal: abortController.signal
          }
        )).data;
      } catch (err) {
        if (!abortController.signal.aborted) {
          appContext.notifyError('An error occured during searching on Hoogle');
          console.log(err);
        }
      } finally {
        appContext.finishTask(taskId);
      }

      if (abortController.signal.aborted) {
        return;
      }

      const searchResults: HoogleSearchResults = groupBy(deduplicate(resData), 'item');

      if (Object.keys(searchResults).length > 0) {
        appContext.writeSearchHistoryEntry(query);
      }

      setSearchResults(searchResults);

      const searchResultsKeys = Object.keys(searchResults);
      setViewModes(zipObject(searchResultsKeys, searchResultsKeys.map(() => globalViewMode)));
    })();

    return () => {
      abortController.abort();
    }

    // XXX - don't add appContext to deps here as eslint suggests.
    // It may cause infinite recursive calls. Fix it if you know how.
  }, [query]);

  const Link = asEmbeddedWidget ? ExtA : A;

  return (
    <div className={s.searchResults}>
      {query.length > 0 && Object.keys(searchResults).length === 0 && (
        <NothingFound waitBeforeShow={1500}>
          Nothing found in Hoogle. Try another query.
        </NothingFound>
      )}
      {Object.keys(searchResults).length > 0 && (
        <Header>
          <div>Found on Hoogle: {Object.keys(searchResults).length}</div>
          <HeaderButton
            text={globalViewMode === 'normal' ? 'Collapse All' : 'Expand All'}
            onClick={() => globalViewMode === 'normal' ? setGlobalViewMode('brief') : setGlobalViewMode('normal')}
            svgIcon={globalViewMode === 'normal' ? viewBrieflyIcon : viewNormallyIcon}
          />
        </Header>
      )}
      <div className={s.searchResultsContainer}>
        {Object.keys(searchResults).map(hoogleItemKey => {
          const hoogleItem = searchResults[hoogleItemKey];
          const [typeName, ..._typeDef] = hoogleItemKey.split(' :: ');
          const typeDef = _typeDef.join('');
          const pkgs = groupBy(hoogleItem, 'package.name');

          const docs = hoogleItem[0].docs
            .replace(/\n\n/g, '\n').trim(); // Apply minimal formatting to make docs look more consistent.

          const itemViewMode = viewModes[hoogleItemKey];

          return (
            <div key={hoogleItemKey} className={`${s.searchResult} ${itemViewMode === 'brief' ? s.searchResultBrief : ''}`}>
              <div className={s.changeHoogleItemViewMode}>
                <HeaderButton
                  text={itemViewMode === 'normal' ? 'Collapse' : 'Expand'}
                  onClick={() => setViewModes({ ...viewModes, [hoogleItemKey]: itemViewMode === 'brief' ? 'normal' : 'brief' })}
                  svgIcon={itemViewMode === 'normal' ? viewBrieflyIcon : viewNormallyIcon}
                />
              </div>
              <Link
                href={rewriteUrl(hoogleItem[0].url)}
                target={asEmbeddedWidget ? '__blank' : '__self'}
                className={`${s.hoogleItemLink} ${s.link} ${itemViewMode === 'brief' ? s.hoogleItemLinkBrief : ''}`}
                analytics={{ featureName: 'HoogleSearchResultItem', eventParams: {} }}
              >
                <strong className={s.hoogleItemTypeName}>{typeName}</strong>{typeDef ? <strong>&nbsp;::&nbsp;</strong> : ''}<span>{typeDef}</span>
              </Link>
              <div className={s.hoogleItemContent}>
                {docs && (
                  <div className={`${s.hoogleItemDocs} ${itemViewMode === 'brief' ? s.hoogleItemDocsBrief : ''}`}>
                    {docs}
                  </div>
                )}
                {itemViewMode === 'normal' && pkgs[Object.keys(pkgs)[0]][0].package.name && <div className={s.hoogleItemPackages}>
                  {Object.keys(pkgs).map(packageKey => {
                    const pkg = pkgs[packageKey];

                    return (
                      <div key={packageKey} className={s.hoogleItemPackage}>
                        <Link
                          href={rewriteUrl(pkg[0].package.url)}
                          target={asEmbeddedWidget ? '__blank' : '__self'}
                          className={s.link}
                          analytics={{ featureName: 'HoogleSearchResultItem', eventParams: {} }}
                        >
                          <small style={{ marginRight: '0.5em' }}>📦</small>{pkg[0].package.name}
                        </Link>
                        <div className={s.hoogleItemModules}>
                          {pkg.map(item => (
                            <Link
                              key={`${packageKey}@${item.module.name}`}
                              href={rewriteUrl(item.module.url)}
                              target={asEmbeddedWidget ? '__blank' : '__self'}
                              className={s.link}
                              analytics={{ featureName: 'HoogleSearchResultModule', eventParams: {} }}
                            >
                              {item.module.name}
                            </Link>
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
    </div>
  )
}

export default HoogleSearchResults;
