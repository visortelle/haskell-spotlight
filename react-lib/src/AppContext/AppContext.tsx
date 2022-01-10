import React, { ReactNode, useCallback, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import s from './AppContext.module.css';
import { Analytics, AnalyticsState } from '../Analytics/Analytics';
import type { Browser } from 'webextension-polyfill';

export const toastContainerId = 'hackage-ui-toast-container';

export type SearchHistory = string[];

export type AppContextValue = {
  notifySuccess: (content: ReactNode) => void,
  notifyError: (content: ReactNode) => void,
  tasks: Record<string, string | undefined>,
  startTask: (id: string, comment?: string) => void,
  finishTask: (id: string) => void,
  writeSearchHistoryEntry: (query: string) => void
  readSearchHistory: () => Promise<SearchHistory>,
  removeSearchHistoryEntry: (query: string) => Promise<void>,
  purgeSearchHistory: () => Promise<void>,
  analytics?: AnalyticsState,
}

const defaultAppContextValue: AppContextValue = {
  notifySuccess: () => { },
  notifyError: () => { },
  tasks: {},
  startTask: () => { },
  finishTask: () => { },
  writeSearchHistoryEntry: () => { },
  readSearchHistory: () => new Promise(() => []),
  removeSearchHistoryEntry: () => new Promise(() => undefined),
  purgeSearchHistory: () => new Promise(() => undefined),
  analytics: undefined,
}

export const AppContext = React.createContext<AppContextValue>(defaultAppContextValue);

export const DefaultAppContextProvider = ({ useNextJSRouting, children, asWebExtension }: { useNextJSRouting: boolean, children: ReactNode, asWebExtension?: boolean }) => {
  // If build for web extension, then expect https://github.com/mozilla/webextension-polyfill in a global object.
  let browser: Browser;
  if (asWebExtension) {
    browser = (global as any).browser;
  }

  const [value, setValue] = useState<AppContextValue>(defaultAppContextValue);

  const storageSetItem = useCallback((k, v: string) => {
    if (asWebExtension) {
      // https://developer.chrome.com/docs/extensions/reference/storage/#type-StorageArea
      // Debug: chrome://sync-internals/
      browser.storage.local.set({ [k]: v });
      return;
    }
    localStorage.setItem(k, v);
  }, [asWebExtension]);

  const storageGetItem = useCallback(async (k) => {
    if (asWebExtension) {
      // https://developer.chrome.com/docs/extensions/reference/storage/#type-StorageArea
      // Debug: chrome://sync-internals/
      return (await browser.storage.local.get(k))[k];
    }
    return localStorage.getItem(k);
  }, [asWebExtension]);

  const notifySuccess = useCallback((content: ReactNode) => toast.success(content, { containerId: toastContainerId }), []);
  const notifyError = useCallback((content: ReactNode) => {
    value.analytics?.gtag('event', 'error', {
      category: value.analytics.categories.issues,
      label: content?.toString() || 'unknown error',
    });

    toast.error(content, { containerId: toastContainerId });
  }, [value.analytics]);

  const startTask = useCallback((id: string, comment?: string) => {
    setValue({
      ...value,
      tasks: { ...value.tasks, [id]: comment }
    });
  }, [value]);

  const searchHistoryStorageKey = 'haskellSearchHistory';
  const readSearchHistory = useCallback(async () => {
    let searchHistory: SearchHistory = [];
    const jsonStr = await storageGetItem(searchHistoryStorageKey);

    try {
      searchHistory = jsonStr === (null || undefined) ? [] : JSON.parse(jsonStr);

      if (searchHistory && !Array.isArray(searchHistory)) {
        throw new Error('Search history is stored in wrong format. It should be an array of strings.');
      }
    } catch (_) {
      const searchHistoryBackupKey = `${searchHistoryStorageKey}_backup_${new Date().toISOString()}`
      await storageSetItem(searchHistoryBackupKey, jsonStr || '[]');

      searchHistory = [];
      await storageSetItem(searchHistoryStorageKey, JSON.stringify(searchHistory));

      notifyError(`Your search history is corrupted. You can get a backup by running 'localStorage.getItem(${searchHistoryBackupKey})' in browser console.`);
    } finally {
      return searchHistory;
    }
  }, [notifyError]);

  const writeSearchHistoryEntry = useCallback(async (query: string) => {
    const searchHistory = await readSearchHistory();
    const newSearchHistory = Array.from(new Set([query].concat(searchHistory).slice(0, 1000)));
    return storageSetItem(searchHistoryStorageKey, JSON.stringify(newSearchHistory));
  }, [readSearchHistory]);

  const removeSearchHistoryEntry = useCallback(async (query: string) => {
    const searchHistory = await readSearchHistory();
    const newSearchHistory = searchHistory.filter(entry => entry !== query);
    return storageSetItem(searchHistoryStorageKey, JSON.stringify(newSearchHistory));
  }, [readSearchHistory]);

  const purgeSearchHistory = useCallback(async () => {
    return await storageSetItem(searchHistoryStorageKey, JSON.stringify([]));
  }, []);

  const finishTask = useCallback((id: string) => {
    let tasks = { ...value.tasks };
    delete tasks[id];

    setValue({ ...value, tasks });
  }, [value]);

  return (
    <>
      <Analytics useNextJSRouting={useNextJSRouting} onChange={(analytics) => setValue({ ...value, analytics })} />
      <AppContext.Provider
        value={{
          ...value,
          notifySuccess,
          notifyError,
          startTask,
          finishTask,
          readSearchHistory,
          writeSearchHistoryEntry,
          purgeSearchHistory,
          removeSearchHistoryEntry
        }}
      >
        <ToastContainer
          enableMultiContainer
          containerId={toastContainerId}
          position="top-right"
          autoClose={3000}
          newestOnTop={true}
          hideProgressBar={true}
          closeOnClick
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          className={s.toastContainer}
          toastClassName={s.toast}
          bodyClassName={s.toastBody}
        />
        {children}
      </AppContext.Provider>
    </>
  )
};
