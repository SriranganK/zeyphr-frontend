import { getReadOnlyContract } from "@/crypto/contract";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "../../ui/scroll-area";
import { Skeleton } from "../../ui/skeleton";
import HomeProductCard from "./product-card";

const contract = getReadOnlyContract();

const Products: React.FC = () => {
  const [productIds, setProductIds] = useState<number[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);

  // fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setFetching(true);
      try {
        setProductIds(await contract.getListedItems());
      } catch {
        toast.error("Failed to fetch products please try again");
      } finally {
        setFetching(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="col-span-2 flex flex-col px-2">
      <p className="self-center text-center text-xl font-semibold capitalize">
        Recently listed products
      </p>
      <ScrollArea
        type="auto"
        className="[&>[data-radix-scroll-area-viewport]]:h-80 [&>[data-radix-scroll-area-viewport]]:pt-4 [&>[data-radix-scroll-area-viewport]]:max-h-80"
      >
        <div className="flex flex-wrap gap-4 sm:gap-8 justify-center">
          {fetching &&
            [..."1234"].map((i) => (
              <Skeleton key={i} className="w-80 sm:w-64 h-[17rem] rounded-xl" />
            ))}
          {productIds.map((pid) => (
            <HomeProductCard key={pid} pid={pid} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Products;
