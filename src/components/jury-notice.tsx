import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle } from "lucide-react";

const JuryNoticeDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hasAcknowledged = localStorage.getItem("zeyphr-faucet-notice-ack");
    if (!hasAcknowledged) {
      setOpen(true);
    }
  }, []);

  const handleCheckboxChange = (checked: boolean) => {
    setDontShowAgain(checked);
    if (checked) {
      localStorage.setItem("zeyphr-faucet-notice-ack", "true");
    } else {
      localStorage.removeItem("zeyphr-faucet-notice-ack");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md max-h-[90vh] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>🧪 Important Notice for Judges</DialogTitle>
        </DialogHeader>
        <ScrollArea type="auto" className="max-h-[60vh] pr-2">
          <DialogDescription className="space-y-4">
            <p>
              After our submission on May 4<sup>th</sup>, the IOTA EVM Faucet we
              relied on (
              <a
                href="https://github.com/iotaledger/evm-toolkit"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                evm-toolkit
              </a>
              ) was officially deprecated by IOTA on May 5<sup>th</sup>🚫.
            </p>
            <p>
              We had used this faucet as a temporary workaround, as we couldn’t
              complete the feature allowing users to deposit IOTA via their bank
              accounts before the deadline 💡.
            </p>
            <p>
              Once the faucet stopped working, users were no longer able to fund
              their wallets. To make your judging experience smoother, we
              transferred the remaining balance to a main wallet containing 4500
              IOTA 💰.
            </p>
            <p>
              Now, when a new user signs up, they automatically receive 100 IOTA
              from this wallet, enabling them to try out key features like
              transfers, scan &amp; pay, tap to pay, product listing, and
              purchases 🛍️. We’ve also added a few low-cost items to support
              testing.
            </p>
            <p>
              Please rest assured, this update was made after the deadline solely
              to assist with evaluation. The core functionality of our platform
              remains unchanged.
            </p>
            <p>
              If you'd like to cross-verify, please feel free to compare the UI/UX
              functionalities in our{" "}
              <a
                href="https://youtu.be/2_dmkKHpmGk?si=LUITiZmzf1zUCH3Y"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                demo video
              </a>{" "}
              with the current version — you should not notice any critical new
              features.
            </p>
            <p>
              For any questions or clarifications, please don’t hesitate to reach
              out to{" "}
              <a
                href="mailto:2020ad0149@svce.ac.in"
                className="underline text-blue-600"
              >
                2020ad0149@svce.ac.in
              </a>{" "}
              📩 — we’ll do our best to respond within 14 hours.
            </p>
            <p>
              Thank you very much for your time and understanding. We truly
              appreciate your efforts in evaluating our project.
            </p>
          </DialogDescription>
        </ScrollArea>
        <div className="flex items-center space-x-2 pt-4">
          <Checkbox
            id="dont-show"
            checked={dontShowAgain}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="dont-show">I understand, don’t show this again</Label>
        </div>
        <DialogFooter className="pt-2">
          <DialogClose asChild>
            <Button className="w-full">
              <CheckCircle className="mr-2 h-4 w-4" />
              Got It
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JuryNoticeDialog;
