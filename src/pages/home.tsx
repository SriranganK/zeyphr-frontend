import Header from "@/components/header";
import { useAppContext } from "@/context/app";
import { getReadOnlyContract } from "@/crypto/contract";
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
      {productIds.map((pid) => <span key={pid}>{pid}</span>)}
    </div>
  );
};

export default HomePage;
