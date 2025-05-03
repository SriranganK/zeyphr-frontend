import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ethers } from "ethers";
import { useState } from "react";
import Checkout from "./checkout";
import ToolTip from "../tooltip";

interface CartProps {
  showCart: boolean;
  setShowCart: (open: boolean) => void;
}

const Cart: React.FC<CartProps> = ({ showCart, setShowCart }) => {
  const { cartItems, removeItem, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + BigInt(item.price ?? "0"),
    BigInt(0)
  );;

  return (
    <>
      {showCheckout ? (
        <Checkout {...{ showCheckout, setShowCheckout, setShowCart }} />
      ) : (
        <Sheet open={showCart} onOpenChange={setShowCart}>
          <SheetContent
            side="right"
            forceMount
            className="rounded-l-xl w-80 sm:w-[500px] p-0 flex flex-col h-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setShowCart(false)}
              >
                <ArrowLeft />
              </Button>
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <ToolTip hideOnMobile content="Clear cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-destructive/10 [&_svg]:text-destructive"
                  onClick={() => clearCart()}
                >
                  <Trash2 />
                </Button>
              </ToolTip>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.tokenId}
                    className="relative flex border p-3 rounded-lg shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt="Product"
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {" "}
                        {ethers.formatEther(item.price ?? "0")} IOTA
                      </p>
                    </div>

                    {/* Delete Icon */}
                    <ToolTip hideOnMobile content="Remove item form cart">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-destructive/10 [&_svg]:text-destructive absolute bottom-2 right-2"
                        onClick={() => removeItem(item.tokenId)}
                      >
                        <Trash2 />
                      </Button>
                    </ToolTip>
                  </div>
                ))
              )}
            </div>

            {/* Amount Details */}
            <div className="p-4 border-t">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{ethers.formatEther(total.toString())} IOTA</span>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => setShowCheckout(true)}
                disabled={!cartItems.length}
              >
                Checkout
                <ArrowRight />
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default Cart;
