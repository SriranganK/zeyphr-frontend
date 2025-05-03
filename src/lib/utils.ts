import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const sleep = (durationMs: number) => 
  new Promise((resolve) => setTimeout(resolve, durationMs));

export function truncateAddress(address: string, showMore?: boolean) {
  if (!address) return ""
  return `${address.slice(0, !showMore ? 6 : 12)}...${address.slice(!showMore ? -4 : -7)}`
}

export const formatCurrency = (amount: string) => 
  (new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(+amount)).slice(1);
