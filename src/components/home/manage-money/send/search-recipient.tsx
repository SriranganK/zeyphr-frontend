import {
  SearchResult,
  SearchResultsSkeleton,
} from "@/components/header/search-input";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppContext } from "@/context/app";
import { CustomJwtPayload, SearchResultUser } from "@/lib/types";
import { cn } from "@/lib/utils";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const SearchReipient: React.FC<SearchReipientProps> = ({
  open,
  setOpen,
  searchInput,
  setSearchInput,
  setFinalUser,
}) => {
  const { token } = useAppContext();
  const publicKey = (
    jwtDecode(token) as CustomJwtPayload
  ).publicKey.toLowerCase();
  const [users, setUsers] = useState<SearchResultUser[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);

  // reset search field when closed
  useEffect(() => {
    if (!open) {
      setSearchInput("");
    }
  }, [open, setSearchInput]);

  // searching users with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchUsers = async () => {
        if (!token) return;
        if (searchInput.length < 3) {
          setUsers([]);
          return;
        }
        try {
          setFetching(true);
          const { data } = await axios.get<SearchResultUser[]>(
            `/users/search?query=${searchInput}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUsers(
            data.filter((user) => user.publicKey.toLowerCase() !== publicKey)
          );
        } finally {
          setFetching(false);
        }
      };

      fetchUsers();
    }, 280);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput, token, publicKey]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
      <DialogHeader className="hidden">
        <DialogTitle>Search</DialogTitle>
        <DialogDescription>Search</DialogDescription>
      </DialogHeader>
      <CommandInput
        value={searchInput}
        onValueChange={setSearchInput}
        placeholder="Search by username, email address"
        autoFocus
      />
      <ScrollArea
        className="p-2 mr-0.5 mt-0.5 [&>[data-radix-scroll-area-viewport]]:max-h-80"
        innerClassName="h-80"
      >
        <CommandList className={cn(searchInput.length < 3 && "hidden")}>
          <CommandEmpty>
            No users found. Try a different search term.
          </CommandEmpty>
        </CommandList>
        {fetching && <SearchResultsSkeleton />}
        {users.map((user) => (
          <CommandItem key={user.publicKey}>
            <SearchResult
              {...{ user, setOpen, fromSendCallback: setFinalUser }}
            />
          </CommandItem>
        ))}
      </ScrollArea>
    </CommandDialog>
  );
};

export default SearchReipient;

interface SearchReipientProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  setFinalUser: React.Dispatch<React.SetStateAction<SearchResultUser | null>>;
}
