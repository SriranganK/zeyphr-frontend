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

const ToolTip: React.FC<ToolTipProps> = ({
  children,
  content,
  className,
  side = "bottom",
  align = "center",
}) => {

  // tooltip in desktop mode
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
};

export default ToolTip;

interface ToolTipProps extends PropsWithChildren {
  content: string;
  className?: ClassNameValue;
  side?: "bottom" | "top" | "right" | "left";
  align?: "center" | "end" | "start";
  hideOnMobile?: boolean;
}