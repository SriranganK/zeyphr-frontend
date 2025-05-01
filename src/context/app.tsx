import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

const defaultState: AppContextState = {
  token: localStorage.getItem("zeyphr-tkn") ?? "",
};

const AppContext = createContext<AppContextState>(defaultState);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);

const AppContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string>(defaultState.token);

  const value: AppContextState = useMemo(() => ({ token, setToken }), [token]);

  // updating context to storage
  useEffect(() => {
    if (token.length > 0) {
      localStorage.setItem("zeyphr-tkn", token);
    }
  }, [token]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;

interface AppContextState {
  token: string;
  setToken?: React.Dispatch<React.SetStateAction<string>>;
}
