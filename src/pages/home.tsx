import Header from "@/components/header";
import ManageMoney from "@/components/home/manage-money";
import Products from "@/components/home/products";
import Transactions from "@/components/home/transactions";
import { useAppContext } from "@/context/app";
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
        <ManageMoney />
        <Transactions />
      </div>
      <Products />
    </div>
  );
};

export default HomePage;
