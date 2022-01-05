import React, { ReactNode, useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import s from './AppContext.module.css';

export type AppContextValue = {
  notifySuccess: (content: ReactNode) => void,
  notifyError: (content: ReactNode) => void,
  startTask: (id: string, comment?: string) => void,
  finishTask: (id: string) => void,
  tasks: Record<string, string | undefined>
}

const defaultAppContextValue: AppContextValue = {
  notifySuccess: () => { },
  notifyError: () => { },
  startTask: () => { },
  finishTask: () => { },
  tasks: {}
}

const AppContext = React.createContext<AppContextValue>(defaultAppContextValue);

export const DefaultAppContextProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState<AppContextValue>(defaultAppContextValue);

  const notifySuccess = useCallback((content: ReactNode) => toast.success(content), []);
  const notifyError = useCallback((content: ReactNode) => toast.error(content), []);

  const startTask = useCallback((id: string, comment?: string) => {
    setValue({
      ...value,
      tasks: { ...value.tasks, [id]: comment }
    });
  }, [value]);

  const finishTask = useCallback((id: string) => {
    let tasks = { ...value.tasks };
    delete tasks[id];

    setValue({ ...value, tasks });
  }, [value]);


  return (
    <AppContext.Provider
      value={{
        ...value,
        notifySuccess,
        notifyError,
        startTask,
        finishTask
      }}
    >
      <>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop={true}
          hideProgressBar={true}
          closeOnClick
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          toastClassName={s.toast}
          bodyClassName={s.toastBody}
        />
        {children}
      </>
    </AppContext.Provider>
  )
};

export default AppContext;
