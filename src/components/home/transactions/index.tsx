import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Globe,
  Layers,
  Loader,
  RotateCcw,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { useAppContext } from "@/context/app";
import { jwtDecode } from "jwt-decode";
import {
  CustomJwtPayload,
  ExplorerTx,
  TransactionFromDB,
  TransactionFromExplorer,
} from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import { EXPLORER_URL } from "@/data/app";
import { ScrollArea } from "../../ui/scroll-area";
import { toast } from "sonner";
import axios from "axios";
import { ethers } from "ethers";
import {
  ExplorerTransactionCard,
  TransactionCard,
  TransactionsSkeleton,
} from "./cards";
import { Button } from "@/components/ui/button";
import ToolTip from "@/components/tooltip";

const Transactions: React.FC = () => {
  const { token } = useAppContext();
  const publicKey = (
    jwtDecode(token) as CustomJwtPayload
  ).publicKey.toLowerCase();
  const [txs, setTxs] = useState<TransactionFromDB[]>([]);
  const [otherTxs, setOtherTxs] = useState<TransactionFromExplorer[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);

  const creditTxs = txs.filter(
    (tx) =>
      typeof tx.to !== "string" && tx.to.publicKey.toLowerCase() === publicKey
  );
  const debitTxs = txs.filter(
    (tx) =>
      typeof tx.from !== "string" && tx.from.publicKey.toLowerCase() === publicKey
  );

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
    <Tabs className="p-4 px-1 pt-0 sm:pt-4" defaultValue="all">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between">
        <div>
          <p className="text-xl font-semibold">Transactions</p>
          <p className="text-sm text-muted-foreground">
            Explore your transactions recorded in Zeyphr and other sources.
          </p>
        </div>
        <div className="flex w-full sm:w-fit justify-between items-end gap-0.5">
          <ToolTip content="Refresh transactions">
            <Button
              size="icon"
              variant="ghost"
              disabled={fetching}
              onClick={fetchUserTransactions}
            >
              {fetching ? (
                <Loader className="animate-spin" />
              ) : (
                <RotateCcw className="text-muted-foreground" />
              )}
            </Button>
          </ToolTip>
          <TabsList className="h-auto p-1 flex flex-wrap">
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
        </div>
      </div>
      <TabsContent
        value="all"
        className="flex flex-col bg-card border border-input rounded-xl shadow-sm gap-4"
      >
        <ScrollArea
          innerClassName="p-2"
          className="rounded-xl mr-1 h-60 [&>[data-radix-scroll-area-viewport]]:max-h-60"
        >
          {fetching && <TransactionsSkeleton />}
          {txs.map((tx) => (
            <TransactionCard key={tx.id} {...{tx, publicKey}} />
          ))}
        </ScrollArea>
      </TabsContent>
      <TabsContent
        value="credit"
        className="flex flex-col bg-card border border-input rounded-xl shadow-sm gap-4"
      >
        <ScrollArea
          innerClassName="p-2"
          className="rounded-xl mr-1 h-60 [&>[data-radix-scroll-area-viewport]]:max-h-60"
        >
          {fetching && <TransactionsSkeleton />}
          {creditTxs.map((tx) => (
            <TransactionCard key={tx.id} {...{tx, publicKey}}  />
          ))}
        </ScrollArea>
      </TabsContent>
      <TabsContent
        value="debit"
        className="flex flex-col bg-card border border-input rounded-xl shadow-sm gap-4"
      >
        <ScrollArea
          innerClassName="p-2"
          className="rounded-xl mr-1 h-60 [&>[data-radix-scroll-area-viewport]]:max-h-60"
        >
          {fetching && <TransactionsSkeleton />}
          {debitTxs.map((tx) => (
            <TransactionCard key={tx.id} {...{tx, publicKey}} />
          ))}
        </ScrollArea>
      </TabsContent>
      <TabsContent
        value="other"
        className="flex flex-col bg-card border border-input rounded-xl shadow-sm gap-4"
      >
        <ScrollArea
          innerClassName="p-2"
          className="rounded-xl mr-1 h-60 [&>[data-radix-scroll-area-viewport]]:max-h-60"
        >
          {fetching && <TransactionsSkeleton />}
          {otherTxs.map((tx) => (
            <ExplorerTransactionCard
              key={tx.txHash}
              {...{tx, publicKey}}
              publicKey={publicKey}
            />
          ))}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default Transactions;
