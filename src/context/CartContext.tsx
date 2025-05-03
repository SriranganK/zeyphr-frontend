import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface CartItem {
  tokenId: number;
  price: string;
  seller: string;
  listed: boolean;
  tokenURI: string;
  image: string;
  name: string;
  description: string;
  availableSupply: number;
}

type CartContextType = {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ✅ Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCartItems(parsed);
      } catch (err) {
        console.error("Failed to parse cart from localStorage", err);
      }
    }
  }, []);

  // ✅ Save cart to localStorage, converting BigInts to strings
  useEffect(() => {
    const replacer = (_key: string, value: any) =>
      typeof value === "bigint" ? value.toString() : value;

    try {
      localStorage.setItem("cart", JSON.stringify(cartItems, replacer));
    } catch (err) {
      console.error("Failed to save cart to localStorage", err);
    }
  }, [cartItems]);

  const addItem = (newItem: CartItem) => {
    console.log(newItem);
    setCartItems((prev) => {
      const exists = prev.find((item) => item.tokenId === newItem.tokenId);
      if (exists) {
        return prev.map((item) =>
          item.tokenId === newItem.tokenId ? { ...item } : item
        );
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (tokenId: number) => {
    setCartItems((prev) => prev.filter((item) => item.tokenId !== tokenId));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
