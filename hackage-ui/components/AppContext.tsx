import React, { ReactNode } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import s from './AppContext.module.css';

export type AppContextProps = {
  notifySuccess: (content: ReactNode) => void,
  notifyError: (content: ReactNode) => void,
  startProgress: (taskId: string) => void,
  stopProgress: (taskId: string) => void
}

const defaultAppContextProps: AppContextProps = {
  notifySuccess: (content) => toast.success(content),
  notifyError: (content) => toast.error(content),
  startProgress: (taskId: string) => { },
  stopProgress: (taskId: string) => { }
}

const AppContext = React.createContext<AppContextProps>(defaultAppContextProps);

export const DefaultAppContextProvider = ({ children }: { children: ReactNode }) => (
  <AppContext.Provider value={defaultAppContextProps}>
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
);

export default AppContext;
