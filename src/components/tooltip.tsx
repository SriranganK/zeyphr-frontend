import { PropsWithChildren } from "react";
import { ClassNameValue } from "tailwind-merge";

// custom
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

const ToolTip: React.FC<ToolTipProps> = ({
  children,
  content,
  className,
  side = "bottom",
  align = "center",
  hideOnMobile = false,
}) => {
  const isMobile = useIsMobile();

  // tooltip in desktop mode
  if (!isMobile) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent
            align={align}
            side={side}
            className={cn("text-justify", className)}
          >
            <small className="text-sm font-medium leading-none">{content}</small>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (hideOnMobile) return children;

  // popover in mobile mode
  return (<></>);
};

export default ToolTip;

interface ToolTipProps extends PropsWithChildren {
  content: string;
  className?: ClassNameValue;
  side?: "bottom" | "top" | "right" | "left";
  align?: "center" | "end" | "start";
  hideOnMobile?: boolean;
}