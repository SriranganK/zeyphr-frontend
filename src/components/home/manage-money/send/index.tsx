import ToolTip from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader, Rocket, UserRoundSearch } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import SearchReipient from "./search-recipient";
import { toast } from "sonner";
import { SearchResultUser } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DICEBEAR_API } from "@/data/app";
import { useAppContext } from "@/context/app";
import axios from "axios";
import { celeberate } from "@/lib/confetti";

const SendMoney: React.FC = () => {
  const location = useLocation();
  const { postPwdCb, token, setPwdOpen } = useAppContext();
  const [amount, setAmount] = useState<string>("");
  const [userKey, setUserKey] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [finalUser, setFinalUser] = useState<SearchResultUser | null>(null);
  const navigate = useNavigate();
  const amountRef = useRef<HTMLInputElement>(null);
  const userKeyRef = useRef<HTMLInputElement>(null);
  const searchParams = new URLSearchParams(location.search);
  const recipientKey = searchParams.get("recipient");
  const [sending, setSending] = useState<boolean>(false);

  const onSearchClick = () => {
    if (userKey.length < 3) {
      toast.error("Recipient field should be at least 3 characters long");
      return;
    }
    setSearchInput(userKey);
    setOpen(true);
  };

  const handleCancel = () => {
    if (finalUser === null) return;
    setUserKey(finalUser.username);
    setSearchInput(finalUser.username);
    setFinalUser(null);
  };

  const handleSend = () => {
    if (finalUser === null || sending || !postPwdCb) return;
    postPwdCb.current = (password: string) => {
      setSending(true);
      const sendTx = axios.post(
        "/transaction/new",
        {
          to: finalUser.publicKey.toLowerCase(),
          amount,
          password,
          paymentMethod: "wallet",
          currency: "IOTA",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.promise(sendTx, {
        loading: `Sending ${amount} IOTA to "${finalUser.username}..."`,
        success: "Transaction successfull!!",
        error: "Transaction failed. Please try again.",
      });
      sendTx
        .then(() => {
          setFinalUser(null);
          setAmount("");
          setUserKey("");
          celeberate();
        })
        .finally(() => setSending(false));
    };
    setPwdOpen!(true);
  };

  useEffect(() => {
    if (recipientKey === null) return;
    setUserKey(recipientKey);
    const params = new URLSearchParams(location.search);
    params.delete("recipient");
    navigate({ search: params.toString() }, { replace: true });
    setTimeout(() => {
      userKeyRef.current?.focus();
      setTimeout(() => {
        amountRef.current?.select();
      }, 500);
    }, 500);
  }, [location.search, navigate, recipientKey]);

  if (finalUser === null) {
    return (
      <>
        {/* amount */}
        <div className="flex flex-col items-center">
          <Input
            autoFocus
            underlined
            value={amount}
            ref={amountRef}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00 IOTA"
            className="text-center border-b-0 text-5xl sm:text-7xl rounded-t-xl"
            type="number"
          />
        </div>
        {/* recipient */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="recipient" className="text-muted-foreground">
            Recipient
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="recipient"
              name="recipient"
              ref={userKeyRef}
              type="search"
              value={userKey}
              onChange={(e) => setUserKey(e.target.value)}
              placeholder="Username, email address"
            />
            <ToolTip
              content="Enter amount before searching for user"
              className={cn(!!amount.length && "hidden")}
            >
              <div>
                <Button disabled={!amount.length} onClick={onSearchClick}>
                  <UserRoundSearch />
                  Search
                </Button>
              </div>
            </ToolTip>
          </div>
        </div>
        {/* recipient search box */}
        <SearchReipient
          {...{ open, setOpen, searchInput, setSearchInput, setFinalUser }}
        />
      </>
    );
  }

  return (
    <>
      <p className="text-muted-foreground">Paying</p>
      <p className="text-2xl font-semibold text-primary">{amount} IOTA</p>
      <p className="text-muted-foreground">to</p>
      <div className="flex items-center gap-2">
        <Avatar className="size-10">
          <AvatarImage
            src={`${DICEBEAR_API}=${finalUser.publicKey}`}
            alt={finalUser.username}
          />
          <AvatarFallback>{finalUser.username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start min-w-0">
          <p className="text-sm font-medium truncate w-full">
            {finalUser.username}{" "}
          </p>
          <p className="text-sm font-medium truncate w-full text-muted-foreground">
            {finalUser.emailAddress}
          </p>
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <Button disabled={sending} variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button disabled={sending} onClick={handleSend}>
          {sending ? <Loader className="animate-spin" /> : <Rocket />}
          Send
        </Button>
      </div>
    </>
  );
};

export default SendMoney;
