import { getAvailableSupply } from "@/crypto/available-supply";
import { getReadOnlyContract } from "@/crypto/contract";
import { HomePageItem, ItemMetaData } from "@/lib/types";
import axios from "axios";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ScrollArea } from "../../ui/scroll-area";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Rocket, ShoppingCart } from "lucide-react";
import { Skeleton } from "../../ui/skeleton";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import ToolTip from "@/components/tooltip";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/app";
import { celeberate } from "@/lib/confetti";
const contract = getReadOnlyContract();

const HomeProductCard: React.FC<HomeProductCardProps> = ({ pid }) => {
  const [itemInfo, setItemInfo] = useState<HomePageItem | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState(false);
  const { addItem, cartItems } = useCart();
  const { postPwdCb, setPwdOpen, token } = useAppContext();
  const [address, setAddress] = useState("");
  const alreadyInCart = cartItems.some((item) => item.tokenId === pid);

  const handleAddCart = () => {
    if (itemInfo === null) return;
    addItem(itemInfo);
    toast.success("Added to cart");
  };

  useEffect(() => {
    const fetchItem = async () => {
      setFetching(true);
      try {
        const itemData = await contract.getItems(pid);
        const tokenURI = await contract.tokenURI(pid);
        const metaData = (await axios.get<ItemMetaData>(tokenURI)).data;
        setItemInfo({
          ...metaData,
          tokenId: pid,
          price: itemData.price.toString(),
          seller: itemData.seller,
          listed: itemData.listed,
          availableSupply: await getAvailableSupply(pid),
          tokenURI,
        });
      } catch {
        toast.error("Failed to fetch item. Please try again");
      } finally {
        setFetching(false);
      }
    };
    fetchItem();
  }, [pid]);

  if (fetching) {
    return <Skeleton className="w-80 sm:w-64 h-[17rem] rounded-xl" />;
  }
  function convertBigIntToString(obj: unknown) {
    return JSON.parse(
      JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  }

  const handlePay = (item: HomePageItem) => {
    if (!postPwdCb) return;
    postPwdCb.current = (password: string) => {
      const requestBody = convertBigIntToString({
        tokenIds: [item.tokenId],
        password,
        paymentMethod: "wallet",
        currency: "IOTA",
        amount: ethers.formatEther(item.price),
      });
      const sendTx = axios.post("/transaction/bulk", requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.promise(sendTx, {
        loading: `Processing payment of ${ethers.formatEther(
          item.price
        )} IOTA...`,
        success: "Product purchased successfully!",
        error: "Payment failed. Please try again.",
      });
      sendTx.then(() => {
        celeberate();
      });
    };
    setPwdOpen!(true);
  };

  return (
    itemInfo && (
      <>
        <div className="hover:scale-105 relative flex flex-col w-80 sm:w-64 h-auto bg-card shadow-sm rounded-xl border border-input pb-2">
          <Badge
            variant="outline"
            className="bg-secondary absolute top-2 left-2 capitalize text-xs font-medium"
          >
            {itemInfo.availableSupply} left in stock
          </Badge>
          <img
            src={itemInfo.image}
            alt={itemInfo.name}
            className="rounded-t-xl h-36 max-h-36 object-contain shadow-sm"
          />
          <div className="px-3 flex items-center justify-between mt-2">
            <p className="text-sm font-semibold text-foreground">
              {itemInfo.name}
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              {ethers.formatEther(itemInfo.price ?? "0")} IOTA
            </p>
          </div>
          <ScrollArea
            type="auto"
            className="px-3 mr-1 min-h-14 [&>[data-radix-scroll-area-viewport]]:max-h-14 mt-1"
          >
            <p className="text-xs text-muted-foreground text-justify leading-snug">
              {itemInfo.description}
            </p>
          </ScrollArea>
          <div className="grid grid-cols-2 gap-2 px-3 mt-1">
            <Button size="sm" onClick={() => setShowDialog(true)}>
              Buy now
            </Button>
            <ToolTip
              content="Item already in cart"
              hideOnMobile
              className={cn(!alreadyInCart && "hidden")}
            >
              <div>
                <Button
                  disabled={alreadyInCart}
                  variant="outline"
                  onClick={handleAddCart}
                  size="sm"
                >
                  <ShoppingCart />
                  Add to cart
                </Button>
              </div>
            </ToolTip>
          </div>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-2xl p-0 overflow-hidden w-half">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Ready to Buy?</h2>
            </div>

            {/* Address Input */}
            <div className="grid w-half items-center gap-1.5 px-3 pt-4">
              <Label htmlFor="address" className="text-muted-foreground">
                Shipping Address
              </Label>
              <Textarea
                id="address"
                name="address"
                autoFocus
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-28 max-h-28 resize-none"
                placeholder="1234 Imaginary Lane, Suite 404, Nowhere City, ZZ 99999 – Next to the Unicorn Stable"
              />
            </div>

            {/* Product Preview */}
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={itemInfo.image}
                  alt="Product"
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <p className="text-sm font-medium">{itemInfo.name}</p>
                  <p className="text-xs text-gray-500 max-w-[200px] truncate">
                    {itemInfo.description}
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    {ethers.formatEther(itemInfo.price)} IOTA
                  </p>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <div className="p-4 border-t">
              <ToolTip
                content="Kindly add billing address"
                className={cn(address.length > 0 && "hidden")}
              >
                <div>
                  <Button
                    disabled={!address.length}
                    className="w-full"
                    onClick={() => {
                      handlePay(itemInfo);
                      setShowDialog(false);
                    }}
                  >
                    <Rocket className="mr-2 h-4 w-4" />
                    Pay {ethers.formatEther(itemInfo.price)} IOTA
                  </Button>
                </div>
              </ToolTip>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  );
};

export default HomeProductCard;

interface HomeProductCardProps {
  pid: number;
}
