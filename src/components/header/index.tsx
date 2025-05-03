import { Link } from "react-router";
import zeyphrLogo from "../../assets/images/logo.png";
import { jwtDecode } from "jwt-decode";
import { useAppContext } from "@/context/app";
import { CustomJwtPayload } from "@/lib/types";
import { useState } from "react";
import LogOutConfirmation from "./logout";
import SearchInput from "./search-input";
import AvatarActions from "./actions";
import HeaderBalance from "./balance";

const Header: React.FC = () => {
  const { token } = useAppContext();
  const publicKey = (
    jwtDecode(token) as CustomJwtPayload
  ).publicKey.toLowerCase();
  const [showLogout, setShowLogout] = useState<boolean>(false);

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
          <HeaderBalance />
          <AvatarActions {...{ publicKey, setShowLogout }} />
        </div>
      </div>
      <LogOutConfirmation {...{ showLogout, setShowLogout }} />
    </>
  );
};

export default Header;
