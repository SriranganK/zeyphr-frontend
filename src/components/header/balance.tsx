import { Loader, Send } from "lucide-react";
import ToolTip from "../tooltip";
import { useCallback, useEffect, useState } from "react";
import { getWalletBalance } from "@/crypto/balance";
import { useAppContext } from "@/context/app";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FAUCET_LINK } from "@/data/app";

const HeaderBalance: React.FC = () => {
  const { token } = useAppContext();
  const { publicKey } = jwtDecode(token) as CustomJwtPayload;
  const [balance, setBalance] = useState<string>("--");
  const [balanceFetching, setBalanceFetching] = useState<boolean>(false);

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
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer hover:opacity-50">
          {balanceFetching ? (
            <ToolTip hideOnMobile content="Fetching balance...">
              <Loader className="size-5 animate-spin text-muted-foreground" />
            </ToolTip>
          ) : (
            <p className="font-medium">{balance}</p>
          )}
          <p className="text-sm">ETH</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>💧 Free ETH for Testing</DialogTitle>
          <DialogDescription>
            Since this is an MVP/beta version, you can get free ETH to try out
            the app. Just use our faucet link below—no wallet funding needed!
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Input readOnly defaultValue={FAUCET_LINK} />
          <ToolTip content="Go to Faucet">
            <Button size="icon" asChild>
              <a href={FAUCET_LINK} target="_blank" rel="noopener noreferrer">
                <Send />
              </a>
            </Button>
          </ToolTip>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HeaderBalance;
