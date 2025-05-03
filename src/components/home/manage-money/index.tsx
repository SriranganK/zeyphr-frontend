import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ScanLine,
  BanknoteArrowDown,
  BanknoteArrowUp,
  UserRoundSearch,
  DraftingCompass,
  Wine,
} from "lucide-react";

const ManageMoney: React.FC = () => {
  return (
    <Tabs className="p-4" defaultValue="send">
      <TabsList className="self-center h-auto p-1">
        <TabsTrigger value="send" className="flex flex-col gap-0.5 px-4 py-1.5">
          <ArrowUpRight />
          Send
        </TabsTrigger>
        <TabsTrigger value="receive" className="flex flex-col gap-0.5 px-4 py-1.5">
          <ArrowDownLeft />
          Receive
        </TabsTrigger>
        <TabsTrigger value="scan-pay" className="flex flex-col gap-0.5 px-4 py-1.5">
          <ScanLine />
          Scan & Pay
        </TabsTrigger>
        <TabsTrigger value="withdraw" className="flex flex-col gap-0.5 px-4 py-1.5">
          <BanknoteArrowDown />
          Withdraw
        </TabsTrigger>
        <TabsTrigger value="deposit" className="flex flex-col gap-0.5 px-4 py-1.5">
          <BanknoteArrowUp />
          Deposit
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="send"
        className="flex flex-col items-center justify-center bg-card border border-input rounded-xl shadow-sm gap-4"
      >
        {/* amount */}
        <div className="flex flex-col items-center">
          <Input
            autoFocus
            underlined
            placeholder="0.0"
            className="text-center border-b-0 text-7xl"
            type="number"
          />
          <p className="font-light">ETH</p>
        </div>
        {/* recipient */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="recipient" className="text-muted-foreground">
            Recipient
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="recipient"
              type="search"
              placeholder="Username, public address, email address"
            />
            <Button>
              <UserRoundSearch />
              Search
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="withdraw"
        className="flex flex-col items-center justify-center bg-card border border-input rounded-xl shadow-sm gap-4"
      >
        <DraftingCompass className="size-20 text-destructive opacity-70 animate-pulse" />
        <p className="text-xl text-muted-foreground animate-pulse">
          Under Construction
        </p>
      </TabsContent>
      <TabsContent
        value="deposit"
        className="flex flex-col items-center justify-center bg-card border border-input rounded-xl shadow-sm gap-4"
      >
        <Wine className="size-20 text-destructive opacity-70 animate-pulse" />
        <p className="text-xl text-muted-foreground animate-pulse">
          Stay Tuned
        </p>
      </TabsContent>
    </Tabs>
  );
};

export default ManageMoney;
