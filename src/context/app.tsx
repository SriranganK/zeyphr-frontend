import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const defaultState: AppContextState = {
  token: localStorage.getItem("zeyphr-tkn") ?? "",
  pwdOpen: false,
};

const AppContext = createContext<AppContextState>(defaultState);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);

const AppContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string>(defaultState.token);
  const postPwdCb = useRef<(password: string) => void>(() => {});
  const [pwdOpen, setPwdOpen] = useState<boolean>(defaultState.pwdOpen);

  const value: AppContextState = useMemo(
    () => ({ 
      token, 
      setToken, 
      postPwdCb, 
      pwdOpen, 
      setPwdOpen 
    }),
    [token, postPwdCb, pwdOpen]
  );

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
  postPwdCb?: React.RefObject<((password: string) => void) | null>;
  pwdOpen: boolean;
  setPwdOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
