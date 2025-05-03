import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/app";
import { CustomJwtPayload } from "@/lib/types";
import { jwtDecode } from "jwt-decode";
import { Coins } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";

const Receive: React.FC = () => {
  const { token } = useAppContext();
  const publicKey = (
    jwtDecode(token) as CustomJwtPayload
  ).publicKey.toLowerCase();
  const [txId] = useState<string>(crypto.randomUUID());
  const [amount, setAmount] = useState<string>("");

  return (
    <>
      {amount.length > 0 ? (
        <QRCode
          value={`zeyphr://qrpay?pub=${publicKey}&am=${amount}&id=${txId}`}
          className="size-36 rounded"
        />
      ) : (
        <div className="bg-accent text-muted-foreground border border-input rounded text-center size-36 flex items-center justify-center">
          Kindly enter amount before generating the QR code
        </div>
      )}
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="amount" className="text-muted-foreground">
          Amount
        </Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          value={amount}
          startIcon={Coins}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00 IOTA"
        />
      </div>
    </>
  );
};

export default Receive;
