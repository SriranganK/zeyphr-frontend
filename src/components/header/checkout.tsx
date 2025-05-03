import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ethers } from "ethers";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface CheckoutProps {
  showCheckout: boolean;
  setShowCheckout: (open: boolean) => void;
  setShowCart: (open: boolean) => void;
}

const Checkout: React.FC<CheckoutProps> = ({
  showCheckout,
  setShowCheckout,
  setShowCart,
}) => {
  const { cartItems } = useCart();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + BigInt(item.price ?? "0"),
    BigInt(0)
  );
  const delivery = subtotal > 0n ? BigInt("5000000000000000000") : BigInt(0); // 5 IOTA
  const total = subtotal + delivery;

  return (
    <Sheet open={showCheckout} onOpenChange={setShowCheckout}>
      <SheetContent
        side="right"
        forceMount
        className="w-[400px] sm:w-[500px] p-0 flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button onClick={() => setShowCheckout(false)} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">Checkout</h2>
          <button
            className="p-2 text-blue-600 font-medium"
            onClick={() => {
              setShowCheckout(false);
              setShowCart(false);
            }}
          >
            Cancel
          </button>
        </div>

        {/* Shipping Address */}
        <div className="p-4 border-b flex items-start justify-between">
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-1">Billing Address</h3>
            {isEditingAddress ? (
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter shipping address"
                className="border p-2 w-full text-sm rounded-md"
              />
            ) : address ? (
              <p className="text-sm text-gray-700">{address}</p>
            ) : (
              <p className="text-sm text-gray-500">
                Please add a shipping address.
              </p>
            )}
          </div>
          <button
            className="text-blue-600 text-sm font-medium ml-2"
            onClick={() => setIsEditingAddress(!isEditingAddress)}
          >
            {isEditingAddress ? "Save" : "Edit"}
          </button>
        </div>

        {/* Order Details */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 border-b">
          <h3 className="text-md font-semibold mb-2">Order Details</h3>
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">No items in cart.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.tokenId}
                className="flex items-center justify-between space-x-3 border p-2 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt="Product"
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-semibold whitespace-nowrap pl-2">
                  {ethers.formatEther(item.price ?? "0")} IOTA
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="p-4 bg-white space-y-3 border-t">
          <h3 className="text-md font-semibold">Order Summary</h3>
          <div className="flex justify-between text-sm">
            <span>Sub Total</span>
            <span>{ethers.formatEther(subtotal)} IOTA</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery</span>
            <span>{ethers.formatEther(delivery)} IOTA</span>
          </div>
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>{ethers.formatEther(total)} IOTA</span>
          </div>
          <Button className="w-full rounded-lg">
            Pay {ethers.formatEther(total)} IOTA
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Checkout;
