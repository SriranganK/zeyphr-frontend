import Header from "@/components/header";
import ManageMoney from "@/components/home/manage-money";
import Products from "@/components/home/products";
import Transactions from "@/components/home/transactions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppContext } from "@/context/app";
import { Navigate } from "react-router";

const HomePage: React.FC = () => {
  const { token } = useAppContext();

  if (!token.length) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-screen h-screen flex flex-col p-3 overflow-y-auto gap-4 sm:gap-0">
      <Header />
      <ScrollArea>
        <div className="flex flex-col sm:grid sm:grid-cols-2 w-full h-full sm:gap-4 sm:gap-y-2">
          <ManageMoney />
          <Transactions />
          <Products />
        </div>
      </ScrollArea>
    </div>
  );
};

export default HomePage;
