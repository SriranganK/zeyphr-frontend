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
import { SearchResultUser } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DICEBEAR_API } from "@/data/app";
import { Link } from "react-router";
// import { useAppContext } from "@/context/app";
// import axios from "axios";

const SearchInput: React.FC = () => {
  const isMobile = useIsMobile();
  // const {token} = useAppContext();
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");

  useEffect(() => {
    if (open) {
      setSearchInput("");
    }
  }, [open]);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     if (!token) return;
  //     try {
  //       const {data} = await axios.get("/users/search?query=suraj", {
  //         headers: {
  //           Authorization: `Beared ${token}`,
  //         }
  //       });
  //       console.log({ data });
  //     } catch (err) {
  //       console.log({ err });
  //     }
  //   };
  //   fetchUsers();
  // }, [token]);

  return (
    <>
      {isMobile ? (
        <Button size="icon" variant="ghost" onClick={() => setOpen(true)}>
          <Search className="text-muted-foreground" />
        </Button>
      ) : (
        <Input
          startIcon={Search}
          type="search"
          placeholder="Search by username, public address, email address"
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
          placeholder="Search by username, public address, email address"
          autoFocus
        />
        <ScrollArea
          className="p-2 mr-0.5 mt-0.5 [&>[data-radix-scroll-area-viewport]]:max-h-80"
          innerClassName="h-80"
        >
          <CommandList>
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandItem>
              <SearchResult
                user={{
                  _id: "0",
                  username: "Nikhil",
                  publicKey: crypto.randomUUID(),
                }}
              />
            </CommandItem>
            <CommandItem>
              <SearchResult
                user={{
                  _id: "1",
                  username: "Suraj",
                  publicKey: crypto.randomUUID(),
                }}
              />
            </CommandItem>
            <CommandItem>
              <SearchResult
                user={{
                  _id: "2",
                  username: "Srirangan",
                  publicKey: crypto.randomUUID(),
                }}
              />
            </CommandItem>
            <CommandItem>
              <SearchResult
                user={{
                  _id: "3",
                  username: "Venkat",
                  publicKey: crypto.randomUUID(),
                }}
              />
            </CommandItem>
          </CommandList>
        </ScrollArea>
      </CommandDialog>
    </>
  );
};

export default SearchInput;

const SearchResult: React.FC<SearchResultProps> = ({ user }) => {
  return (
    <Link to={`/users/${user.username}`} className="cursor-pointer w-full">
      <CommandItem asChild className="w-full cursor-pointer">
        <Button variant="ghost" className="justify-start">
          <Avatar>
            <AvatarImage src={`${DICEBEAR_API}=${user.publicKey}`} />
            <AvatarFallback>{user.username}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <p>{user.username}</p>
            <p className="text-sm text-muted-foreground">{user.publicKey}</p>
          </div>
        </Button>
      </CommandItem>
    </Link>
  );
};

interface SearchResultProps {
  user: SearchResultUser;
}
