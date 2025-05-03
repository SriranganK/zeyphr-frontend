import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRoundSearch } from "lucide-react";
import { useRef, useState } from "react";

const SendMoney: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [userKey, setUserKey] = useState<string>("");
  const amountRef = useRef<HTMLInputElement>(null);
  const userKeyRef = useRef<HTMLInputElement>(null);

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
            placeholder="Username, public address, email address"
          />
          <Button disabled={!amount.length}>
            <UserRoundSearch />
            Search
          </Button>
        </div>
      </div>
    </>
  );
};

export default SendMoney;
