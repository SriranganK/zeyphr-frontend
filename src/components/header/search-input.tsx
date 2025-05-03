import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { CustomJwtPayload, SearchResultUser } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DICEBEAR_API } from "@/data/app";
import { useAppContext } from "@/context/app";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

const SearchInput: React.FC = () => {
  const isMobile = useIsMobile();
  const { token } = useAppContext();
  const publicKey = (
    jwtDecode(token) as CustomJwtPayload
  ).publicKey.toLowerCase();
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [users, setUsers] = useState<SearchResultUser[]>([]);

  // reset search field when closed
  useEffect(() => {
    if (!open) {
      setSearchInput("");
    }
  }, [open]);

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
    <>
      {isMobile ? (
        <Button size="icon" variant="ghost" onClick={() => setOpen(true)}>
          <Search />
        </Button>
      ) : (
        <Input
          startIcon={Search}
          type="search"
          placeholder="Search by username, email"
          className="w-md text-center"
          onClick={() => setOpen(true)}
        />
      )}
      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <DialogHeader className="hidden">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Search</DialogDescription>
        </DialogHeader>
        <CommandInput
          value={searchInput}
          onValueChange={setSearchInput}
          placeholder="Search by username, email"
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
              <SearchResult {...{ user, setOpen }} />
            </CommandItem>
          ))}
        </ScrollArea>
      </CommandDialog>
    </>
  );
};

export default SearchInput;

export const SearchResult: React.FC<SearchResultProps> = ({
  user,
  setOpen,
  fromSendCallback,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (fromSendCallback !== undefined) {
      fromSendCallback(user);
      setOpen(false);
      return;
    }
    const params = new URLSearchParams(location.search);
    params.set("profile", user.username);
    navigate({ search: params.toString() }, { replace: false });
    setOpen(false);
  };

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      className="w-full justify-start gap-4 px-2 py-2"
      aria-label={`Select user ${user.username}`}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={`${DICEBEAR_API}=${user.publicKey}`}
          alt={user.username}
        />
        <AvatarFallback>{user.username[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start min-w-0">
        <p className="text-start text-sm font-medium truncate w-full">
          {user.username}
        </p>
        <p className="text-start text-xs text-muted-foreground truncate w-full">
          {user.emailAddress}
        </p>
      </div>
    </Button>
  );
};

interface SearchResultProps {
  user: SearchResultUser;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fromSendCallback?: React.Dispatch<
    React.SetStateAction<SearchResultUser | null>
  >;
}

const SearchResultSkeleton: React.FC = () => {
  return (
    <div className="flex items-center w-full gap-4 px-2 py-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex flex-col gap-1 w-full">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
    </div>
  );
};

export const SearchResultsSkeleton: React.FC = () => (
  <>
    <CommandItem>
      <SearchResultSkeleton />
    </CommandItem>
    <CommandItem>
      <SearchResultSkeleton />
    </CommandItem>
    <CommandItem>
      <SearchResultSkeleton />
    </CommandItem>
    <CommandItem>
      <SearchResultSkeleton />
    </CommandItem>
  </>
);
