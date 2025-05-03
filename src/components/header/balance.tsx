import { BookKey, Check, Copy, Loader, Send } from "lucide-react";
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
import { toast } from "sonner";
import { FAUCET_LINK } from "@/data/app";
import { Label } from "@radix-ui/react-label";

const HeaderBalance: React.FC = () => {
  const { token } = useAppContext();
  const publicKey = (
    jwtDecode(token) as CustomJwtPayload
  ).publicKey.toLowerCase();
  const [balance, setBalance] = useState<string>("--");
  const [balanceFetching, setBalanceFetching] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) return;
    try {
      setBalanceFetching(true);
      setBalance(await getWalletBalance(publicKey));
    } finally {
      setBalanceFetching(false);
    }
  }, [publicKey]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(publicKey)
      .then(() => {
        setCopied(true);
        toast.success("Your public address has been copied to clipboard.");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() =>
        toast.error("Failed to copy public address. Please try again.")
      );
  };

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
          <DialogTitle>🚀 Free ETH for Testing</DialogTitle>
          <DialogDescription>
            <br />
            Welcome to our MVP/Beta version! To help you explore the app, you
            can claim free ETH — courtesy of the IOTA team.
            <br />
            <br />
            Just copy your public address from below and paste it into the
            faucet. No wallet funding needed! ✅ Jump in and start testing right
            away.
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="public-key" className="text-muted-foreground">
            Your Public Address
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="public-key"
              name="public-key"
              readOnly
              startIcon={BookKey}
              defaultValue={publicKey}
            />
            <ToolTip content="Copy public address">
              <Button size="icon" onClick={handleCopy} variant="outline">
                {copied ? (
                  <Check className="text-primary" />
                ) : (
                  <Copy className="text-primary" />
                )}
              </Button>
            </ToolTip>
          </div>
        </div>
        <Button asChild>
          <a href={FAUCET_LINK} target="_blank" rel="noopener noreferrer">
            <Send />
            Go to Faucet
          </a>
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default HeaderBalance;
