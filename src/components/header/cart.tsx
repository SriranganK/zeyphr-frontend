import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ethers } from "ethers";
import { useState } from "react";
import Checkout from "./checkout";

interface CartProps {
  showCart: boolean;
  setShowCart: (open: boolean) => void;
}

const Cart: React.FC<CartProps> = ({ showCart, setShowCart }) => {
    const { cartItems, removeItem, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);


const subtotal = cartItems.reduce(
  (sum, item) => sum + BigInt(item.price ?? "0"),
  BigInt(0)
);
const delivery = subtotal > 0n ? BigInt("5000000000000000000") : BigInt(0); // 5 IOTA
const total = subtotal + delivery;

  return (
    <Sheet open={showCart} onOpenChange={setShowCart}>
      <SheetContent
        side="right"
        forceMount
        className="w-[400px] sm:w-[500px] p-0 flex flex-col h-full"
      >
        {showCheckout ? (
          <>
            <Checkout {...{ showCheckout, setShowCheckout, setShowCart }} />
          </>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <button onClick={() => setShowCart(false)} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <button className="p-2" onClick={() => clearCart()}>
                <Trash2 className="w-5 h-5" />
              </button>
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
                    <button
                      className="absolute bottom-2 right-2 p-1"
                      onClick={() => removeItem(item.tokenId)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Amount Details */}
            <div className="p-4 border-t bg-white">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Sub Total</span>
                  <span> {ethers.formatEther(subtotal.toString())} IOTA</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{ethers.formatEther(delivery.toString())} IOTA</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{ethers.formatEther(total.toString())} IOTA</span>
                </div>
              </div>
              <Button
                className="w-full rounded-lg"
                onClick={() => setShowCheckout(true)}
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
