import { getAvailableSupply } from "@/crypto/available-supply";
import { getReadOnlyContract } from "@/crypto/contract";
import { HomePageItem, ItemMetaData } from "@/lib/types";
import axios from "axios";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ScrollArea } from "../../ui/scroll-area";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "../../ui/skeleton";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import ToolTip from "@/components/tooltip";
import { cn } from "@/lib/utils";

const contract = getReadOnlyContract();

const HomeProductCard: React.FC<HomeProductCardProps> = ({ pid }) => {
  const [itemInfo, setItemInfo] = useState<HomePageItem | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const { addItem, cartItems } = useCart();

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

  return (
    itemInfo && (
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
          <Button size="sm">Buy now</Button>
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
    )
  );
};

export default HomeProductCard;

interface HomeProductCardProps {
  pid: number;
}
