"use client";

import * as React from "react";
import { ClassNameValue } from "tailwind-merge";

// custom
import { cn } from "@/lib/utils";
import { Eye, EyeOff, LucideProps } from "lucide-react";
import { Button } from "./button";
import ToolTip from "../tooltip";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      className,
      type,
      startIcon: StartIcon,
      endIcon: EndIcon,
      underlined,
      containerClassName,
      disabled,
      ...props
    },
    ref,
  ) => {
    // states
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    // local variables
    const PasswordIcon = showPassword ? Eye : EyeOff;

    // acts like toggle, called when eye icon
    // is pressed
    const handleShowPassword = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className={cn("w-full relative", containerClassName)}>
        <input
          type={type !== "password" ? type : showPassword ? "text" : "password"}
          className={cn(
            "selection:bg-primary selection:text-primary-foreground flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50",
            StartIcon && "pl-10",
            EndIcon && "pr-10",
            underlined &&
            "h-auto rounded-none border-0 border-b px-0 py-0 focus-visible:ring-0",
            className,
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        {StartIcon && (
          <StartIcon
            className={cn(
              "absolute left-4 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground",
              disabled && "opacity-50",
            )}
          />
        )}
        {type === "password" ? (
          <ToolTip
            content={!showPassword ? "Show password" : "Hide password"}
          >
            <Button
              disabled={disabled}
              onClick={handleShowPassword}
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2  -translate-y-1/2 size-4 text-muted-foreground"
            >
              <PasswordIcon />
            </Button>
          </ToolTip>
        ) : (
          EndIcon && (
            <EndIcon
              className={cn(
                "absolute right-4 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground",
                disabled && "opacity-50",
              )}
            />
          )
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export interface CustomInputProps extends InputProps {
  startIcon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  endIcon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  underlined?: boolean;
  containerClassName?: ClassNameValue;
}

export { Input };