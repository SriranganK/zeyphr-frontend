import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  Globe,
  Layers,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAppContext } from "@/context/app";
import { jwtDecode } from "jwt-decode";
import {
  CustomJwtPayload,
  ExplorerTx,
  TransactionFromDB,
  TransactionFromExplorer,
} from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DICEBEAR_API, EXPLORER_URL } from "@/data/app";
import { truncateAddress } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import ToolTip from "../tooltip";
import { toast } from "sonner";
import axios from "axios";
import { ethers } from "ethers";

const Transactions: React.FC = () => {
  const { token } = useAppContext();
  const publicKey = (
    jwtDecode(token) as CustomJwtPayload
  ).publicKey.toLowerCase();
  const [txs, setTxs] = useState<TransactionFromDB[]>([]);
  const [otherTxs, setOtherTxs] = useState<TransactionFromExplorer[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);

  const creditTxs = txs.filter((tx) => tx.to === publicKey);
  const debitTxs = txs.filter((tx) => tx.from === publicKey);

  const fetchUserTransactions = useCallback(async () => {
    try {
      setFetching(true);
      // fetch from db
      const { data } = await axios.get<TransactionFromDB[]>(
        `/transaction?publicKey=${publicKey}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // fetch from explorer
      const { data: explorerTxs } = await axios.get<{ result: ExplorerTx[] }>(
        `${EXPLORER_URL}/api/?module=account&action=txlist&address=${publicKey}`
      );
      setTxs([...data.reverse()]);
      setOtherTxs(
        explorerTxs.result
          .filter((tx) => !data.some((ztx) => ztx.txHash === tx.hash))
          .map((tx) => ({
            txHash: tx.hash,
            from: tx.from,
            to: tx.to,
            amount: ethers.formatEther(tx.value ?? "0"),
            timestamp: tx.timeStamp,
          }))
      );
    } catch {
      toast.error("Failed to fetch transactions. Please try again.");
    } finally {
      setFetching(false);
    }
  }, [publicKey, token]);

  // fetching all the transactions
  // of ther user
  useEffect(() => {
    fetchUserTransactions();
  }, [fetchUserTransactions]);

  return (
    <Tabs className="p-4" defaultValue="all">
      <TabsList className="self-center h-auto p-1">
        <TabsTrigger
          value="all"
          disabled={fetching}
          className="flex flex-col gap-1 px-4 py-1.5"
        >
          <Layers />
          All
        </TabsTrigger>
        <TabsTrigger
          value="credit"
          disabled={fetching}
          className="flex flex-col gap-1 px-4 py-1.5"
        >
          <ArrowDownToLine />
          Credit
        </TabsTrigger>
        <TabsTrigger
          value="debit"
          disabled={fetching}
          className="flex flex-col gap-1 px-4 py-1.5"
        >
          <ArrowUpFromLine />
          Debit
        </TabsTrigger>
        <TabsTrigger
          value="other"
          disabled={fetching}
          className="flex flex-col gap-1 px-4 py-1.5"
        >
          <Globe />
          Other
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="all"
        className="flex flex-col bg-card border border-input rounded-xl shadow-sm gap-4"
      >
        <ScrollArea
          innerClassName="p-2"
          className="rounded-xl mr-1 [&>[data-radix-scroll-area-viewport]]:max-h-60"
        >
          {txs.map((tx) => (
            <Transaction key={tx.id} tx={tx} publicKey={publicKey} />
          ))}
        </ScrollArea>
      </TabsContent>
      <TabsContent
        value="credit"
        className="flex flex-col bg-card border border-input rounded-xl shadow-sm gap-4"
      >
        <ScrollArea
          innerClassName="p-2"
          className="rounded-xl mr-1 [&>[data-radix-scroll-area-viewport]]:max-h-60"
        >
          {creditTxs.map((tx) => (
            <Transaction key={tx.id} tx={tx} publicKey={publicKey} />
          ))}
        </ScrollArea>
      </TabsContent>
      <TabsContent
        value="debit"
        className="flex flex-col bg-card border border-input rounded-xl shadow-sm gap-4"
      >
        <ScrollArea
          innerClassName="p-2"
          className="rounded-xl mr-1 [&>[data-radix-scroll-area-viewport]]:max-h-60"
        >
          {debitTxs.map((tx) => (
            <Transaction key={tx.id} tx={tx} publicKey={publicKey} />
          ))}
        </ScrollArea>
      </TabsContent>
      <TabsContent
        value="other"
        className="flex flex-col bg-card border border-input rounded-xl shadow-sm gap-4"
      >
        <ScrollArea
          innerClassName="p-2"
          className="rounded-xl mr-1 [&>[data-radix-scroll-area-viewport]]:max-h-60"
        >
          {otherTxs.map((tx) => (
            <ExplorerTransaction
              key={tx.txHash}
              tx={tx}
              publicKey={publicKey}
            />
          ))}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default Transactions;

const Transaction: React.FC<TransactionProps> = ({ tx, publicKey }) => {
  const isCredit = tx.to.toLowerCase() === publicKey.toLowerCase();
  const otherPersonId = isCredit ? tx.from : tx.to;

  return (
    <ToolTip content="View transaction in explorer">
      <div className="hover:bg-accent rounded-xl px-3 py-1 mr-1.5">
        <a
          href={`${EXPLORER_URL}/tx/${tx.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-10">
                <AvatarImage src={`${DICEBEAR_API}=${otherPersonId}`} />
                <AvatarFallback>{otherPersonId}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {isCredit ? "Received from" : "Sent to"}{" "}
                  <span className="font-semibold">Suraj Vijayan</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  surajvijay67@gmail.com
                </div>
                <div className="text-xs text-muted-foreground">
                  {truncateAddress(otherPersonId)} •{" "}
                  {format(new Date(tx.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <div
                className={`text-lg font-semibold ${
                  isCredit ? "text-green-600" : "text-red-600"
                }`}
              >
                {isCredit ? "+" : "-"}
                {tx.amount} {tx.currency}
              </div>
              <StatusBadge status={tx.status} />
              <div className="text-xs text-muted-foreground">
                via {tx.paymentMethod.toUpperCase()}
              </div>
            </div>
          </div>
        </a>
      </div>
    </ToolTip>
  );
};

interface TransactionProps {
  tx: TransactionFromDB;
  publicKey: string;
}

const ExplorerTransaction: React.FC<ExplorerTransactionProps> = ({
  tx,
  publicKey,
}) => {
  const isCredit = tx.to.toLowerCase() === publicKey.toLowerCase();
  const otherPersonId = isCredit ? tx.from : tx.to;

  return (
    <ToolTip content="View transaction in explorer">
      <div className="hover:bg-accent rounded-xl px-3 py-1 mr-1.5">
        <a
          href={`${EXPLORER_URL}/tx/${tx.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-10">
                <AvatarImage src={`${DICEBEAR_API}=${otherPersonId}`} />
                <AvatarFallback>{otherPersonId}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {isCredit ? "Received" : "Sent"}{" "}
                </div>
                <div className="text-sm text-muted-foreground">
                  {truncateAddress(otherPersonId, true)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(+tx.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <div
                className={`text-lg font-semibold ${
                  isCredit ? "text-green-600" : "text-red-600"
                }`}
              >
                {isCredit ? "+" : "-"}
                {tx.amount} ETH
              </div>
              <StatusBadge status="success" />
            </div>
          </div>
        </a>
      </div>
    </ToolTip>
  );
};

interface ExplorerTransactionProps {
  tx: TransactionFromExplorer;
  publicKey: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "success":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Success
        </Badge>
      );
    case "failure":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Failed
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
  }
};

interface StatusBadgeProps {
  status: TransactionFromDB["status"];
}
