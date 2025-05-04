import { DICEBEAR_API } from "@/data/app";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ToolTip from "../tooltip";
import { CreditCard, LogOut, Settings, UserRoundPen } from "lucide-react";
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

const AvatarActions: React.FC<AvatarActionsProps> = ({
  setShowLogout,
  setShowManageCard,
  publicKey,
}) => {
  const isMobile = useIsMobile();

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
        {isMobile && (
          <>
            <DrawerHeader className="pb-0">
              <DrawerTitle>Actions</DrawerTitle>
              <DrawerDescription />
              <div className="flex items-center justify-between">
                <p>Balance</p>
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
          variant={isMobile ? ("ghost" as "default") : "default"}
          className="justify-start"
        >
          <Settings />
          Settings
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
