import Header from "@/components/header";
import HomeProductCard from "@/components/home/product-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppContext } from "@/context/app";
import { getReadOnlyContract } from "@/crypto/contract";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { toast } from "sonner";

const contract = getReadOnlyContract();

const HomePage: React.FC = () => {
  const { token } = useAppContext();
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

  if (!token.length) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-screen h-screen flex flex-col p-3">
      <Header />
      <div className="flex flex-col px-2">
        <div className="self-center flex items-center gap-2">
          <Sparkles />
          <p className="text-xl font-medium capitalize">
            Recently listed products
          </p>
        </div>
        <ScrollArea
          type="auto"
          className="[&>[data-radix-scroll-area-viewport]]:py-4 [&>[data-radix-scroll-area-viewport]]:max-h-80"
        >
          <div className="flex flex-wrap gap-4 sm:gap-8 justify-center">
            {fetching &&
              [..."1234"].map((i) => (
                <Skeleton key={i} className="w-80 sm:w-64 h-72 rounded-xl" />
              ))}
            {productIds.map((pid) => (
              <HomeProductCard key={pid} pid={pid} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default HomePage;
