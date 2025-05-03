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
import { UserInfo } from "@/lib/types";
import { toast } from "sonner";
import { Rocket } from "lucide-react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DICEBEAR_API } from "@/data/app";

const ProfileCard: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userKey = searchParams.get("profile");
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
  }, [location.search, navigate, userKey]);

  return (
    <Dialog open={open} onOpenChange={fetching ? undefined : handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="hidden">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
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
        <DialogFooter>
          <Button disabled={fetching}>
            <Rocket />
            Send Money
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCard;
