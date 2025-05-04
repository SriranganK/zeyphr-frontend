"use client";

import { useState } from "react";
import axios from "axios";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAppContext } from "@/context/app";
import { toast } from "sonner";
import UserCollection from "./prodListByOwner";

interface ManageProductsSheetProps {
  showManageProducts?: boolean;
  setShowManageProducts?: (open: boolean) => void;
}

export default function ManageProductsSheet({ showManageProducts, setShowManageProducts }: ManageProductsSheetProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transferable, setTransferable] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { postPwdCb, setPwdOpen, token } = useAppContext();

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postPwdCb) return;

    postPwdCb.current = async (password: string) => {
      try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("password", password);
        formData.append("description", description);
        formData.append("quantity", quantity);
        formData.append("transferable", String(transferable));
        if (!transferable) {
          formData.append("amount", amount);
        }
        if (file) {
          formData.append("file", file);
        }

        const sendTx = axios.post("/products/new", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        toast.promise(sendTx, {
          loading: "Adding new Product...",
          success: "Product added successfully!",
          error: "Transaction failed. Please try again.",
        });

        // Optionally close dialog and reset form
        setDialogOpen(false);
        setTitle("");
        setDescription("");
        setAmount("");
        setQuantity("");
        setFile(null);
        setTransferable(false);
      } catch (err) {
        console.error(err);
        toast.error("Unexpected error occurred");
      }
    };

    setPwdOpen!(true);
  };

  return (
    <div>
      <Sheet open={showManageProducts} onOpenChange={setShowManageProducts}>
        <SheetContent side="bottom" className="h-[90%]">
          <div className="relative border-b pb-4 p-3">
            <h2 className="text-center text-lg font-semibold">
              Manage Products
            </h2>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="absolute right-4 top-2 " size="sm">
                  Add Product
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Product</DialogTitle>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleAddProduct}>
                  <div>
                    <Label>Title</Label>
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Product title"
                      required
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Product description"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="transferable">Transferable</Label>
                    <Switch
                      id="transferable"
                      checked={transferable}
                      onCheckedChange={setTransferable}
                    />
                  </div>

                  {!transferable && (
                    <div>
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Enter quantity"
                      required
                    />
                  </div>

                  <div>
                    <Label>Upload File</Label>
                    <Input
                      type="file"
                      onChange={(e) =>
                        setFile(e.target.files ? e.target.files[0] : null)
                      }
                    />
                  </div>

                  <div className="pt-4 text-right">
                    <Button type="submit">Add</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-6 space-y-4">
            <UserCollection {...{token}} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}



