import { useLocation, useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CustomJwtPayload, UserInfo } from "@/lib/types";
import { toast } from "sonner";
import { Rocket } from "lucide-react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DICEBEAR_API } from "@/data/app";
import { jwtDecode } from "jwt-decode";
import { useAppContext } from "@/context/app";
import { Skeleton } from "../ui/skeleton";

const ProfileCard: React.FC = () => {
  const location = useLocation();
  const { token } = useAppContext();
  const searchParams = new URLSearchParams(location.search);
  const userKey = searchParams.get("profile");
  const publicKey = (
    jwtDecode(token) as CustomJwtPayload
  ).publicKey.toLowerCase();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);

  const handleClose = (openState: boolean) => {
    if (!openState) {
      const params = new URLSearchParams(location.search);
      params.delete("profile");
      navigate({ search: params.toString() }, { replace: true });
    }
    setOpen(openState);
  };

  const handleSendMoney = () => {
    if (userInfo === null) return;
    const params = new URLSearchParams(location.search);
    params.delete("profile");
    params.set("recipient", userInfo.username);
    navigate({ search: params.toString() }, { replace: true });
  };

  // fetching user data
  useEffect(() => {
    setOpen(userKey !== null);
    const fetchUser = async () => {
      if (!userKey) return;
      try {
        setFetching(true);
        const { data } = await axios.get<UserInfo>(
          `/users/fetch-user?query=${userKey}`
        );
        if (data.publicKey.toLowerCase() === publicKey) {
          throw "Your profile";
        }
        setUserInfo(data);
      } catch {
        toast.error("Couldn't find user.");
        const params = new URLSearchParams(location.search);
        params.delete("profile");
        navigate({ search: params.toString() }, { replace: true });
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [location.search, navigate, userKey, publicKey]);

  return (
    <Dialog open={open} onOpenChange={fetching ? undefined : handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="hidden">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        {fetching && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32 mx-auto" />
              <Skeleton className="h-4 w-40 mx-auto" />
              <Skeleton className="h-3 w-48 mx-auto" />
            </div>
          </div>
        )}
        {userInfo && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Avatar className="w-16 h-16">
              <AvatarImage src={`${DICEBEAR_API}=${userInfo.publicKey}`} />
              <AvatarFallback>
                {userInfo.username?.slice(0, 2)?.toUpperCase() || "US"}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <p className="text-sm font-medium">{userInfo.username}</p>
              <p className="text-sm text-muted-foreground">
                {userInfo.emailAddress}
              </p>
              <p className="text-xs break-all text-muted-foreground">
                {userInfo.publicKey}
              </p>
            </div>
          </div>
        )}
        <DialogFooter className="flex sm:justify-center">
          <Button disabled={fetching} onClick={handleSendMoney}>
            <Rocket />
            Send Money
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCard;
