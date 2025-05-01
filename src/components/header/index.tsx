import { Link } from "react-router";
import zeyphrLogo from "../../assets/images/logo.png";
import { Loader } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useAppContext } from "@/context/app";
import { CustomJwtPayload } from "@/lib/types";
import ToolTip from "../tooltip";
import { getWalletBalance } from "@/crypto/balance";
import { useCallback, useEffect, useState } from "react";
import LogOutConfirmation from "./logout";
import SearchInput from "./search-input";
import AvatarActions from "./actions";

const Header: React.FC = () => {
  const { token } = useAppContext();
  const { publicKey } = jwtDecode(token) as CustomJwtPayload;
  const [balance, setBalance] = useState<string>("--");
  const [balanceFetching, setBalanceFetching] = useState<boolean>(false);
  const [showLogout, setShowLogout] = useState<boolean>(false);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) return;
    try {
      setBalanceFetching(true);
      setBalance(await getWalletBalance(publicKey));
    } finally {
      setBalanceFetching(false);
    }
  }, [publicKey]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return (
    <>
      <div className="w-full bg-card flex items-center justify-between rounded-xl border shadow-sm p-2">
        {/* top left branding */}
        <Link to="/home">
          <div className="flex items-center gap-1 hover:opacity-50">
            <img src={zeyphrLogo} alt="Zeyphr Logo" className="size-10" />
            <p className="text-xl font-medium">Zeyphr</p>
          </div>
        </Link>
        {/* search bar */}
        <div className="hidden sm:block">
          <SearchInput />
        </div>
        {/* balance and user actions */}
        <div className="flex items-center gap-2">
          <div className="sm:hidden">
            <SearchInput />
          </div>
          <div className="flex items-center gap-1">
            {balanceFetching ? (
              <ToolTip hideOnMobile content="Fetching balance...">
                <Loader className="size-5 animate-spin text-muted-foreground" />
              </ToolTip>
            ) : (
              <p className="font-medium">{balance}</p>
            )}
            <p className="text-sm">ETH</p>
          </div>
          <AvatarActions {...{ publicKey, setShowLogout }} />
        </div>
      </div>
      <LogOutConfirmation {...{ showLogout, setShowLogout }} />
    </>
  );
};

export default Header;
