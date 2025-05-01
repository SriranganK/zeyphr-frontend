import Header from "@/components/header";
import { useAppContext } from "@/context/app";
import { Navigate } from "react-router";

const HomePage: React.FC = () => {
  const { token } = useAppContext();

  if (!token.length) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-screen h-screen flex flex-col p-3">
      <Header />
    </div>
  );
};

export default HomePage;
