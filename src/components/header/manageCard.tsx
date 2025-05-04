"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "@/context/app";
import { FetchUserResponse } from "@/lib/types";
import { toast } from "sonner";
import { Loader, ShieldCheck, ShieldX } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { celeberate } from "@/lib/confetti";

export default function EnableNFCDialog({
  showManageCard,
  setShowManageCard,
  publicKey
}: {
  showManageCard: boolean;
  setShowManageCard: (open: boolean) => void;
  publicKey: string;
}) {
  const { postPwdCb, setPwdOpen } = useAppContext();
  const [enabled, setEnabled] = useState(false);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { token } = useAppContext();

  // fetching user info
  useEffect(() => {
    if (!showManageCard) return;
    const fetchUser = async () => {
      try {
        setFetching(true);
        const { data } = await axios.get<FetchUserResponse>(
          `/users/fetch-user?query=${publicKey}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEnabled(data.card === "enabled");
        setAddress(data.card !== "enabled" ? "" : data.billingAddress);
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [publicKey, showManageCard, token]);

  const handleEnableTapAndPay = () => {
    if (loading || !postPwdCb) return;
    postPwdCb.current = (password: string) => {
      setLoading(true);
      const enableTapTx = axios.post(
        "/machine/card/enable-tap-and-pay",
        {
          billingAddress: address,
          password,
          enabled: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      toast.promise(enableTapTx, {
        loading: "Enabling tap and pay for your account...",
        success: "Tap and pay enabled successfully!!",
        error: "Failed to enable tap and pay. Please try again."
      })
      enableTapTx
        .then(() => {
          setShowManageCard(false);
          celeberate();
        })
        .finally(() => setLoading(false));
    };
    setPwdOpen!(true);
  };

  const handleDisableTapAndPay = () => {
    if (loading || !postPwdCb) return;
    postPwdCb.current = () => {
      setLoading(true);
      const disableTapTx = axios.post(
        "/machine/card/enable-tap-and-pay",
        {
          enabled: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.promise(disableTapTx, {
        loading: "Disabling tap and pay",
        success: "Tap and pay has been disabled successfully!!",
        error: "Failed to disable tap & pay. Please try again."
      });
      disableTapTx
        .then(() => setShowManageCard(false))
        .finally(() => setLoading(false));
    };
    setPwdOpen!(true);
  };

  return (
    <Dialog 
      open={showManageCard} 
      onOpenChange={loading? undefined : setShowManageCard}>
      <DialogContent>
        {!fetching ? <>
          <DialogHeader>
            <DialogTitle>
              {!enabled
                ? "Enable Tap & Pay"
                : "Tap & Pay is Enabled"}
            </DialogTitle>
            <DialogDescription>{
              !enabled ?
                "To activate Tap & Pay, please provide your shipping address. This helps us verify and issue a compatible card."
                : "Your card currently supports Tap & Pay. Would you like to disable this feature?"}</DialogDescription>
          </DialogHeader>
          {!enabled &&
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="address" className="text-muted-foreground">
                Shipping Address
              </Label>
              <Textarea
                id="address"
                name="address"
                autoFocus
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="h-28 max-h-28 resize-none"
                placeholder="1234 Imaginary Lane, Suite 404, Nowhere City, ZZ 99999 – Next to the Unicorn Stable"
              />
            </div>}
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowManageCard(false)}
            >Cancel</Button>
            {!enabled ?
              <Button
                onClick={handleEnableTapAndPay}
                disabled={loading || !address.length}
              >
                {loading
                  ? <Loader className="animate-spin" />
                  : <ShieldCheck />}
                Enable tap and pay
              </Button> :
              <Button
                variant="destructive"
                onClick={handleDisableTapAndPay}
                disabled={loading}
              >
                {loading
                  ? <Loader className="animate-spin" />
                  : <ShieldX />}
                Disable tap and pay
              </Button>}
          </DialogFooter>
        </> : <>
          <DialogHeader>
            <DialogTitle className="hidden" />
            <DialogDescription className="hidden" />
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </DialogHeader>
          <Skeleton className="h-32 w-full" />
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Skeleton className="h-9 sm:w-28" />
            <Skeleton className="h-9 sm:w-28" />
          </div>
        </>}
      </DialogContent>
    </Dialog>
  );
}
