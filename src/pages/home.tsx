import Header from "@/components/header";
import Products from "@/components/home/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/app";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BanknoteArrowDown,
  BanknoteArrowUp,
  DraftingCompass,
  Rocket,
  ScanLine,
  UserRoundSearch,
  Wine,
} from "lucide-react";
import { Navigate } from "react-router";

const HomePage: React.FC = () => {
  const { token } = useAppContext();

  if (!token.length) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-screen h-screen flex flex-col p-3 gap-4">
      <Header />
      <div className="grid grid-cols-2 w-full h-full gap-4">
        <Tabs className="p-4" orientation="vertical">
          <TabsList defaultValue="send" className="self-center h-auto p-1">
            <TabsTrigger value="send" className="flex flex-col gap-0.5">
              <ArrowUpRight />
              Send
            </TabsTrigger>
            <TabsTrigger value="receive" className="flex flex-col gap-0.5">
              <ArrowDownLeft />
              Receive
            </TabsTrigger>
            <TabsTrigger value="scan-pay" className="flex flex-col gap-0.5">
              <ScanLine />
              Scan & Pay
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="flex flex-col gap-0.5">
              <BanknoteArrowDown />
              Withdraw
            </TabsTrigger>
            <TabsTrigger value="deposit" className="flex flex-col gap-0.5">
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
                  placeholder="Username, public key, email address"
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
        <div></div>
      </div>
      <Products />
    </div>
  );
};

export default HomePage;
