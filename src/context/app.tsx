import { createContext, PropsWithChildren, useMemo, useState } from "react";

const defaultState: AppContextState = {
  token: localStorage.getItem("zeyphr-tkn") ?? "",
};

const AppContext = createContext<AppContextState>(defaultState);

const AppContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string>("");

  const value: AppContextState = useMemo(() => ({ token, setToken }), [token]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;

interface AppContextState {
  token: string;
  setToken?: React.Dispatch<React.SetStateAction<string>>;
}
