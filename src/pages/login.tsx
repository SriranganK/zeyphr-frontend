import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import zeyphrLogo from "../assets/images/logo.png";
import { ArrowRight } from "lucide-react";
import TermsOfService from "@/components/login/terms";
import PrivacyPolicy from "@/components/login/privacy";
import { isValidEmail } from "@/lib/utils";

const LoginPage: React.FC = () => {
  // states
  const [email, setEmail] = useState<string>("");

  const isEmailValid = isValidEmail(email);

  const handleContinue = () => {
    if (!isEmailValid) return;
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-background px-4">
      <Card className="w-full max-w-80 shadow-xl rounded-2xl">
        <CardContent className="flex flex-col gap-6 p-6">
          <div className="flex items-center gap-4">
            <img src={zeyphrLogo} alt="Zeyphr Logo" className="w-14 h-14" />
            <div>
              <CardTitle className="text-3xl font-semibold">Zeyphr</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Bringing Web3 to everyone
              </CardDescription>
            </div>
          </div>
  
          <p className="text-center text-sm text-muted-foreground">
            Enter your email address to get started
          </p>
  
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john.doe@example.com"
            type="email"
            className="w-full"
          />
        </CardContent>
  
        <CardFooter className="flex flex-col gap-4 px-6 pb-6">
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>By clicking continue, you agree to our</p>
            <div className="flex justify-center items-center gap-1 flex-wrap">
              <TermsOfService />
              <span>and</span>
              <PrivacyPolicy />
              <span>.</span>
            </div>
          </div>
  
          <Button
            disabled={!isEmailValid}
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
