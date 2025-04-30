import { DUMMY_TERMS_OF_SERVICE } from "@/data/login";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

const TermsOfService: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-fit text-xs" size="sm">
          Terms of Service
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
        </DialogHeader>
        <ScrollArea type="auto" className="h-80 pr-4">
          <p className="text-justify">{DUMMY_TERMS_OF_SERVICE}</p>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TermsOfService;
