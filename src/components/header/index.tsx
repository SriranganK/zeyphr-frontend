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
import ProfileCard from "./profile";
import Cart from "./cart";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import ToolTip from "../tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/context/CartContext";
import EnableNFCDialog from "./manageCard";

const Header: React.FC = () => {
  const { token } = useAppContext();
  const { cartItems } = useCart();
  const isMobile = useIsMobile();
  const publicKey = (
    jwtDecode(token) as CustomJwtPayload
  ).publicKey.toLowerCase();
  const [showLogout, setShowLogout] = useState<boolean>(false);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showManageCard, setShowManageCard] = useState<boolean>(false);


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
          <ToolTip hideOnMobile content="View cart">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowCart(true)}
              className="relative"
            >
              <ShoppingCart />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive/80 text-white text-[10px] font-semibold size-4 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Button>
          </ToolTip>
          <HeaderBalance hidden={isMobile} />
          <AvatarActions {...{ publicKey, setShowLogout ,setShowManageCard }} />
        </div>
        <Cart {...{ showCart, setShowCart }} />
      </div>
      <EnableNFCDialog {...{ showManageCard, setShowManageCard ,publicKey}} />
      <LogOutConfirmation {...{ showLogout, setShowLogout }} />
      <ProfileCard />
    </>
  );
};

export default Header;
