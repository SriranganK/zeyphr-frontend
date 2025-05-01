import { useAppContext } from "@/context/app";
import { Navigate } from "react-router";

const HomePage: React.FC = () => {
  const {token} = useAppContext();

  if (!token.length) {
    return <Navigate to="/" />;
  }

  return <>Home page</>;
};

export default HomePage;
