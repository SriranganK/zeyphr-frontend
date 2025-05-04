"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";      
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {  useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "@/context/app";

export default function EnableNFCDialog({
  showManageCard,
  setShowManageCard,
  publicKey
}: {
  showManageCard: boolean;
  setShowManageCard: (open: boolean) => void;
  publicKey: string;
}) {
  const [enabled, setEnabled] = useState(false);
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAppContext();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data }: any = await axios.get<any[]>(
          `/users/fetch-user?query=${publicKey}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEnabled(data.card === "enabled");
        setAddress(data.billingAddress);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [showManageCard]);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/machine/card/enable-tap-and-pay",
        {
          billingAddress: address,
          password,
          enabled,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

    } catch (error) {
      console.error("Failed to enable card:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={showManageCard} onOpenChange={setShowManageCard}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Card</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Enable Card</Label>
            <Switch
              checked={enabled}
              onCheckedChange={async (checked) => {
                if (!checked) {
                  try {
                    setLoading(true);
                    const response = await axios.post(
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
                    console.log("Card disabled:", response.data);
                    setAddress("");
                    setPassword("");
                  } catch (error) {
                    console.error("Failed to disable card:", error);
                  } finally {
                    setLoading(false);
                  }
                }

                setEnabled(checked);
              }}
            />
          </div>

          <div>
            <Label>Billing Address</Label>
            <Textarea
              placeholder="Enter billing address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!enabled}
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!enabled}
            />
          </div>

          <DialogFooter>
            <Button
              onClick={handleVerify}
              disabled={loading || !address || !password || !enabled}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
