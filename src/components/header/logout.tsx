import { useAppContext } from "@/context/app";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";

const LogOutConfirmation: React.FC<LogOutConfirmationProps> = ({
  showLogout,
  setShowLogout,
}) => {
  const { setToken } = useAppContext();
  const { clearCart } = useCart();

  const handleLogOut = () => {
    setToken!("");
    clearCart();
  };

  return (
    <AlertDialog open={showLogout} onOpenChange={setShowLogout}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Log Out</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out? You will need to sign in again to
            continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogOut}>
            Log Out
            <LogOut />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogOutConfirmation;

interface LogOutConfirmationProps {
  showLogout: boolean;
  setShowLogout: React.Dispatch<React.SetStateAction<boolean>>;
}
