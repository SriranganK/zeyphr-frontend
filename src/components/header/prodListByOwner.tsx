import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "@/context/app";

interface Item {
  tokenId: number;
  price: string;
  seller: string;
  buyer: string;
  sold: boolean;
  listed: boolean;
  tokenURI: string;
  image: string;
  name?: string;
  availableSupply: number;
}

interface Change {
  listed?: boolean;
  availableSupply?: number;
}

export default function UserCollection({ token }: { token: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [trackChanges, setTrackChanges] = useState<Record<number, Change>>({});
  const { postPwdCb, setPwdOpen } = useAppContext();

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const response = await axios.get("/products/fetch-items-by-owner", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(response.data.items);
      } catch (err) {
        console.error("Failed to fetch NFTs:", err);
      }
    };

    fetchNFTs();
  }, [token]);

  const updateTrackChanges = (tokenId: number, change: Partial<Change>) => {
    setTrackChanges((prev) => ({
      ...prev,
      [tokenId]: {
        ...prev[tokenId],
        ...change,
      },
    }));
  };

  const incrementSupply = (tokenId: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.tokenId === tokenId
          ? {
              ...item,
              availableSupply: item.availableSupply + 1,
            }
          : item
      )
    );
    updateTrackChanges(tokenId, {
      availableSupply:
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        items.find((i) => i.tokenId === tokenId)?.availableSupply! + 1,
    });
  };

  const decrementSupply = (tokenId: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.tokenId === tokenId && item.availableSupply > 0
          ? {
              ...item,
              availableSupply: item.availableSupply - 1,
            }
          : item
      )
    );
    updateTrackChanges(tokenId, {
      availableSupply:
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        items.find((i) => i.tokenId === tokenId)?.availableSupply! - 1,
    });
  };

  const toggleListStatus = (tokenId: number, listed: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.tokenId === tokenId ? { ...item, listed } : item
      )
    );
    updateTrackChanges(tokenId, { listed });
  };



  const handleSaveChanges = async () => {
    try {
        if (!postPwdCb) return;
        postPwdCb.current = (password:string) => {
          const changes = axios.post(
            "/products/edit",
            {
              password:password,
              changes: Object.entries(trackChanges).map(([tokenId, change]) => ({
                tokenId: parseInt(tokenId),
                ...change,
              }))
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          toast.promise(changes, {
            loading: "Updating Your Changes...",
            success: "Chnages Updated successfully!!",
            error: "Failed to Update. Please try again.",
          });
        };
        setPwdOpen!(true);
    } catch (err) {
      console.error("Error saving changes:", err);
    }
  };
  return (
    <div className="flex flex-col gap-6 p-2">
      <div className="flex flex-wrap gap-4">
        {items.map((item) => {
          const changes = trackChanges[item.tokenId] || {};
          const currentListed = changes.listed ?? item.listed;
          const currentSupply = changes.availableSupply ?? item.availableSupply;

          return (
            <div
              key={item.tokenId}
              className="hover:scale-105 relative flex flex-col w-80 sm:w-64 h-auto bg-card shadow-sm rounded-xl border border-input pb-3"
            >
              <img
                src={item.image}
                alt={item.name || `NFT ${item.tokenId}`}
                className="rounded-t-xl h-36 max-h-36 object-contain shadow-sm"
              />

              <div className="px-3 flex items-center justify-between mt-2">
                <p className="text-sm font-semibold text-foreground">
                  {item.name || `Token #${item.tokenId}`}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  {ethers.formatEther(item.price ?? "0")} IOTA
                </p>
              </div>

              <div className="px-3 mt-2 text-sm flex items-center justify-between">
                <span>Supply:</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => decrementSupply(item.tokenId)}
                  >
                    -
                  </Button>
                  <span>{currentSupply}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => incrementSupply(item.tokenId)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 px-3 mt-2">
                <Button
                  size="sm"
                  disabled={currentListed}
                  onClick={() => toggleListStatus(item.tokenId, true)}
                >
                  List
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={!currentListed}
                  onClick={() => toggleListStatus(item.tokenId, false)}
                >
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  Unlist
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(trackChanges).length > 0 && (
        <div className="mt-6 flex justify-center">
          <Button onClick={handleSaveChanges} className="px-6">
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}
