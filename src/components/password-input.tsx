import { useAppContext } from "@/context/app";
import { useState } from "react";
import { Button } from "./ui/button";
import { KeyRound, Rocket } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Checkbox } from "./ui/checkbox";

const PasswordInput: React.FC = () => {
  const {
    postPwdCb,
    setPwdOpen: setOpen,
    pwdOpen: open,
  } = useAppContext();
  const [password, setPassword] = useState<string>("");
  const [savePwd, setSavePwd] = useState<CheckedState>(true);

  const handleCancel = () => {
    if (postPwdCb) {
      postPwdCb.current = null;
    }
    setOpen!(false);
    if (!savePwd) {
      setPassword("");
    }
  };

  const handleProceed = () => {
    if (postPwdCb) {
      postPwdCb.current!(password);
      postPwdCb.current = null;
    }
    setOpen!(false);
    if (!savePwd) {
      setPassword("");
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Password Input</AlertDialogTitle>
          <AlertDialogDescription>
            Kindly provide your password to proceed further.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid w-full items-center gap-1.5">
          <Input
            autoFocus
            startIcon={KeyRound}
            type="password"
            name="password"
            id="password"
            value={password}
            placeholder="******"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="save-pwd" checked={savePwd} onCheckedChange={setSavePwd} />
          <label
            htmlFor="save-pwd"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Save my password for next transaction
          </label>
        </div>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button disabled={!password.length} onClick={handleProceed}>
            <Rocket />
            Proceed
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasswordInput;
