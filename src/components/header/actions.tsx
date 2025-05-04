import { DICEBEAR_API } from "@/data/app";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ToolTip from "../tooltip";
import { CreditCard, LogOut, UserRoundPen } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import HeaderBalance from "./balance";
import { useEffect, useState } from "react";
import { UserInfo } from "@/lib/types";
import { useAppContext } from "@/context/app";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

const AvatarActions: React.FC<AvatarActionsProps> = ({
  setShowLogout,
  setShowManageCard,
  publicKey,
}) => {
  const { token } = useAppContext();
  const isMobile = useIsMobile();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setFetching(true);
        const { data } = await axios.get<UserInfo>(
          `/users/fetch-user?query=${publicKey}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserInfo(data);
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [publicKey, token]);

  const Wrapper = {
    Root: isMobile ? Drawer : DropdownMenu,
    Trigger: isMobile ? DrawerTrigger : DropdownMenuTrigger,
    Content: isMobile ? DrawerContent : DropdownMenuContent,
    Item: isMobile ? Button : DropdownMenuItem,
  };

  return (
    <Wrapper.Root>
      <ToolTip hideOnMobile content="Actions">
        <Wrapper.Trigger asChild>
          <Avatar className="border cursor-pointer hover:opacity-50 size-10">
            <AvatarImage src={`${DICEBEAR_API}=${publicKey}`} />
            <AvatarFallback>ZR</AvatarFallback>
          </Avatar>
        </Wrapper.Trigger>
      </ToolTip>
      <Wrapper.Content align="end" className="pb-2 sm:pb-1">
        {fetching ? <div className="border-b py-1 mb-1 hidden sm:flex flex-col items-start space-y-0.5">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-4 w-28" />
        </div> : userInfo !== null && (
          <>
            <div className="px-2 py-1 hidden sm:flex sm:flex-col">
              <p className="truncate font-medium">@{userInfo.username}</p>
              <p className="text-xs text-muted-foreground">{userInfo.emailAddress}</p>
            </div>
            <DropdownMenuSeparator className="hidden sm:flex" />
          </>)}
        {isMobile && (
          <>
            <DrawerHeader className="pb-0">
              <DrawerTitle>Actions</DrawerTitle>
              <DrawerDescription />
              <div className="flex items-center justify-between">
                {fetching ? <div className="flex flex-col items-start space-y-0.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div> : userInfo !== null && <div className="flex flex-col items-start">
                  <p className="text-xs">@{userInfo.username}</p>
                  <p className="text-xs text-muted-foreground">{userInfo.emailAddress}</p>
                </div>}
                <HeaderBalance />
              </div>
            </DrawerHeader>
          </>
        )}
        <Wrapper.Item
          variant={isMobile ? ("ghost" as "default") : "default"}
          className="justify-start"
        >
          <UserRoundPen />
          Manage Profile
        </Wrapper.Item>
        <Wrapper.Item
          variant={isMobile ? ("ghost" as "default") : "default"}
          className="justify-start"
          onClick={() => setShowManageCard(true)}
        >
          <CreditCard />
          Manage Card
        </Wrapper.Item>
        <Wrapper.Item
          variant={isMobile ? ("ghost" as "default") : "destructive"}
          onClick={() => setShowLogout(true)}
          className="justify-start text-destructive"
        >
          <LogOut className="text-destructive" />
          Log Out
        </Wrapper.Item>
      </Wrapper.Content>
    </Wrapper.Root>
  );
};

export default AvatarActions;

interface AvatarActionsProps {
  publicKey: string;
  setShowLogout: React.Dispatch<React.SetStateAction<boolean>>;
  setShowManageCard: React.Dispatch<React.SetStateAction<boolean>>;
}
