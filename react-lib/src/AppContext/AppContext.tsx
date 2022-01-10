import React, { ReactNode, useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import s from './AppContext.module.css';
import { Analytics, AnalyticsState } from '../Analytics/Analytics';

export type SearchHistory = string[];

export type AppContextValue = {
  notifySuccess: (content: ReactNode) => void,
  notifyError: (content: ReactNode) => void,
  tasks: Record<string, string | undefined>,
  startTask: (id: string, comment?: string) => void,
  finishTask: (id: string) => void,
  writeSearchHistoryEntry: (query: string) => void
  readSearchHistory: () => SearchHistory,
  removeSearchHistoryEntry: (query: string) => void,
  purgeSearchHistory: () => void,
  analytics?: AnalyticsState,
}

const defaultAppContextValue: AppContextValue = {
  notifySuccess: () => { },
  notifyError: () => { },
  tasks: {},
  startTask: () => { },
  finishTask: () => { },
  writeSearchHistoryEntry: () => { },
  readSearchHistory: () => [],
  removeSearchHistoryEntry: () => [],
  purgeSearchHistory: () => { },
  analytics: undefined
}

export const AppContext = React.createContext<AppContextValue>(defaultAppContextValue);

export const DefaultAppContextProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState<AppContextValue>(defaultAppContextValue);

  const notifySuccess = useCallback((content: ReactNode) => toast.success(content), []);
  const notifyError = useCallback((content: ReactNode) => {
    value.analytics?.gtag('event', 'error', {
      category: value.analytics.categories.issues,
      label: content?.toString() || 'unknown error',
    });

    toast.error(content);
  }, [value.analytics]);

  const startTask = useCallback((id: string, comment?: string) => {
    setValue({
      ...value,
      tasks: { ...value.tasks, [id]: comment }
    });
  }, [value]);

  const searchHistoryLsKey = 'searchHistory';
  const readSearchHistory = useCallback(() => {
    let searchHistory: SearchHistory = [];
    const jsonStr = localStorage.getItem(searchHistoryLsKey);

    try {
      searchHistory = jsonStr === null ? [] : JSON.parse(jsonStr);

      if (searchHistory && !Array.isArray(searchHistory)) {
        throw new Error('Search history is stored in wrong format. It should be an array of strings.');
      }
    } catch (_) {
      const historyBackupKey = `${searchHistoryLsKey}_backup_${new Date().toISOString()}`
      localStorage.setItem(historyBackupKey, jsonStr || '[]');
      notifyError(`Your search history is corrupted. You can get a backup by running 'localStorage.getItem(${historyBackupKey})' in browser console.`);
    } finally {
      return searchHistory;
    }
  }, [notifyError]);

  const writeSearchHistoryEntry = useCallback((query: string) => {
    const searchHistory = readSearchHistory();
    const newSearchHistory = Array.from(new Set([query].concat(searchHistory).slice(0, 1000)));
    localStorage.setItem(searchHistoryLsKey, JSON.stringify(newSearchHistory));
  }, [readSearchHistory]);

  const removeSearchHistoryEntry = useCallback((query: string) => {
    const searchHistory = readSearchHistory();
    const newSearchHistory = searchHistory.filter(entry => entry !== query);
    localStorage.setItem(searchHistoryLsKey, JSON.stringify(newSearchHistory));
  }, [readSearchHistory]);

  const purgeSearchHistory = useCallback(() => {
    localStorage.removeItem(searchHistoryLsKey);
  }, []);

  const finishTask = useCallback((id: string) => {
    let tasks = { ...value.tasks };
    delete tasks[id];

    setValue({ ...value, tasks });
  }, [value]);

  return (
    <>
      <Analytics onChange={(analytics) => setValue({ ...value, analytics })} />
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
