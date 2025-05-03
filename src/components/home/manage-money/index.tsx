import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ScanLine,
  BanknoteArrowDown,
  BanknoteArrowUp,
  PiggyBank,
  HandCoins,
} from "lucide-react";
import SendMoney from "./send";
import Receive from "./receive";

const ManageMoney: React.FC = () => {
  return (
    <Tabs className="p-4 px-1 pt-0 sm:pt-4 gap-3" defaultValue="send">
      <div className="w-full flex items-center justify-between gap-1 sm:gap-0">
        <div>
          <p className="text-xl font-semibold">Your Crypto Toolkit</p>
          <p className="text-sm text-muted-foreground">
            Quickly move your crypto
          </p>
        </div>
        <TabsList className="self-center h-auto p-1 flex flex-wrap">
          <TabsTrigger
            value="send"
            className="flex flex-col gap-0.5 px-4 py-1.5"
          >
            <ArrowUpRight />
            Send
          </TabsTrigger>
          <TabsTrigger
            value="receive"
            className="flex flex-col gap-0.5 px-4 py-1.5"
          >
            <ArrowDownLeft />
            Receive
          </TabsTrigger>
          <TabsTrigger
            value="scan-pay"
            className="flex flex-col gap-0.5 px-4 py-1.5"
          >
            <ScanLine />
            Scan & Pay
          </TabsTrigger>
          <TabsTrigger
            value="withdraw"
            className="flex flex-col gap-0.5 px-4 py-1.5"
          >
            <BanknoteArrowDown />
            Withdraw
          </TabsTrigger>
          <TabsTrigger
            value="deposit"
            className="flex flex-col gap-0.5 px-4 py-1.5"
          >
            <BanknoteArrowUp />
            Deposit
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        value="send"
        className="p-2 sm:p-0 flex flex-col items-center justify-center bg-card border border-input rounded-xl shadow-sm gap-2"
      >
        <SendMoney />
      </TabsContent>
      <TabsContent
        value="receive"
        className="p-2 sm:p-0 flex flex-col items-center justify-center bg-card border border-input rounded-xl shadow-sm gap-2"
      >
        <Receive />
      </TabsContent>
      <TabsContent
        value="withdraw"
        className="flex flex-col items-center justify-center bg-card border border-input rounded-2xl shadow-md gap-3 py-10 px-6 text-center"
      >
        <HandCoins className="size-16 text-muted-foreground animate-bounce" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Withdraw Coming Soon
          </h3>
          <p className="text-sm text-muted-foreground">
            We’re working on it — stay tuned for updates!
          </p>
        </div>
      </TabsContent>
      <TabsContent
        value="deposit"
        className="flex flex-col items-center justify-center bg-card border border-input rounded-2xl shadow-md gap-3 py-10 px-6 text-center"
      >
        <PiggyBank className="size-16 text-muted-foreground animate-bounce" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Deposit Feature Incoming
          </h3>
          <p className="text-sm text-muted-foreground">
            Hold tight — you’ll be able to deposit soon.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ManageMoney;
