import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";

const SearchInput: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Button size="icon" variant="ghost">
        <Search />
      </Button>
    );
  }

  return (
    <Input
      startIcon={Search}
      type="search"
      placeholder="Search by address, usernames"
      className="w-md text-center"
    />
  );
};

export default SearchInput;
