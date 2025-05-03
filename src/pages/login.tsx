import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import zeyphrLogo from "../assets/images/logo.png";
import {
  ArrowRight,
  Info,
  KeyRound,
  Loader,
  LogIn,
  Mail,
  Rocket,
} from "lucide-react";
import TermsOfService from "@/components/login/terms";
import PrivacyPolicy from "@/components/login/privacy";
import { cn, isValidEmail } from "@/lib/utils";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import axios, { isAxiosError } from "axios";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAppContext } from "@/context/app";
import { Navigate } from "react-router";

const LoginPage: React.FC = () => {
  const { token, setToken } = useAppContext();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [verificationId, setVerificationId] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const [isExistingUser, setIsExistingUser] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const isEmailValid = isValidEmail(email);

  const sendVerificationCode = () => {
    if (!isEmailValid || loading || step !== 0) {
      toast.error("Email format is invalid");
      return;
    }
    setLoading(true);
    const emailVerificationCodePromise = axios.post<{ uid: string }>(
      "/otp/new",
      {
        emailAddress: email,
      }
    );
    toast.promise(emailVerificationCodePromise, {
      loading: `Sending verification code to "${email}"...`,
      success: `Verification code has been sent to "${email}" successfully!`,
      error: `Failed to send verification code. Please try again.`,
    });
    emailVerificationCodePromise
      .then(({ data }) => {
        setVerificationId(data.uid);
        setStep(1);
      })
      .finally(() => setLoading(false));
  };

  const handleCancel = () => {
    if (loading) return;
    setStep(0);
    setVerificationId("");
    setIsExistingUser(false);
    setPassword("");
    setConfirmPassword("");
  };

  const handleOtpComplete = (otp: string) => {
    setLoading(true);
    const emailVerificationCodePromise = axios.post<{ verified: boolean }>(
      "/otp/validate",
      {
        uid: verificationId,
        otp,
      }
    );
    emailVerificationCodePromise
      .then(({ data }) => {
        if (data.verified) {
          setStep(2);
          setVerificationId("");
        }
      })
      .catch((err) => {
        if (isAxiosError(err)) {
          if (err.response?.data.error === "Invalid OTP") {
            toast.error("Invalid OTP. Please try again.");
          }
        }
      })
      .finally(() => setLoading(false));
  };

  const handleLoginOrCreate = () => {
    if (loading) return;

    if (password.length < 6) {
      toast.error("Password must at least be 6 characters long.");
      return;
    }

    const cleanUp = () => {
      setEmail("");
      setVerificationId("");
      setStep(0);
      setIsExistingUser(false);
      setPassword("");
      setConfirmPassword("");
    };

    // new user
    if (!isExistingUser) {
      if (password !== confirmPassword) {
        toast.error("Passwords doesn't match.");
        return;
      }
      setLoading(true);
      const registerUserPromise = axios.post<{ token: string }>("/users/new", {
        emailAddress: email,
        password,
      });
      toast.promise(registerUserPromise, {
        loading: "Creating account...",
        success: "Account has been created successfully!!",
        error: "Failed to create account. Please try again.",
      });
      registerUserPromise
        .then(({ data }) => {
          setToken!(data.token);
          cleanUp();
        })
        .catch((err) => {
          if (isAxiosError(err)) {
            if (err.response?.data.error === "User already exists") {
              toast.error("User already exists");
              return;
            }
          }
        })
        .finally(() => setLoading(false));
    }
    // existing user
    else {
      setLoading(true);
      const loginUserPromise = axios.post<{ success: boolean; token: string }>(
        "/auth/login",
        {
          emailAddress: email,
          password,
        }
      );
      toast.promise(loginUserPromise, {
        loading: "Authenticating...",
        success: "Logged in successfully!!",
        error: "Failed to login. Please try again.",
      });
      loginUserPromise
        .then(({ data }) => {
          if (data.success) {
            setToken!(data.token);
            setStep(0);
            cleanUp();
          }
        })
        .catch((err) => {
          if (isAxiosError(err)) {
            toast.error(err.response?.data.error ?? "Some error occured");
            return;
          }
        })
        .finally(() => setLoading(false));
    }
  };

  // when in step 2 check user
  // is new or old
  useEffect(() => {
    if (step === 2 && email.length > 0) {
      const checkAccountStatus = async () => {
        setLoading(true);
        try {
          const { data } = await axios.post(`/users/check-email`, {
            emailAddress: email,
          });
          setIsExistingUser(data.existing);
        } finally {
          setLoading(false);
        }
      };
      checkAccountStatus();
    }
  }, [step, email]);

  if (token.length > 0) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-background px-4">
      <Card className="w-full max-w-80 sm:max-w-96">
        <div className="flex flex-col items-center sm:gap-4 justify-center">
          <div className="flex items-center gap-2">
            <img src={zeyphrLogo} alt="Zeyphr Logo" className="size-14" />
            <CardTitle className="text-4xl sm:text-6xl font-semibold">
              Zeyphr
            </CardTitle>
          </div>
          <CardDescription className="text-lg sm:text-xl text-muted-foreground">
            Bringing Web3 to everyone
          </CardDescription>
        </div>
        <CardContent className="flex flex-col gap-6 p-6 pt-0 sm:pt-6">
          {step === 0 && (
            <>
              <p className="text-center text-sm text-muted-foreground">
                Enter your email address to get started
              </p>
              <Input
                name="email"
                startIcon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                type="email"
                className="w-full"
                disabled={loading}
              />
            </>
          )}
          {step === 1 && (
            <div className="w-full flex flex-col gap-6 items-center justify-center">
              <p className="text-center text-sm text-muted-foreground">
                Enter the verification code sent to {email}
              </p>
              <InputOTP
                autoFocus
                pattern={REGEXP_ONLY_DIGITS}
                maxLength={6}
                onComplete={handleOtpComplete}
                disabled={loading}
                name="otp"
              >
                {[..."012345"].map((idx) => (
                  <InputOTPGroup key={idx}>
                    <InputOTPSlot index={Number(idx)} />
                  </InputOTPGroup>
                ))}
              </InputOTP>
            </div>
          )}
          {step === 2 && (
            <>
              {loading ? (
                <div className="flex flex-col items-center gap-2 animate-pulse">
                  <Loader className="animate-spin" />
                  <p className="text-center text-sm text-muted-foreground">
                    Checking account status
                  </p>
                </div>
              ) : (
                <>
                  {/* email address */}
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email" className="text-muted-foreground">
                      Email
                    </Label>
                    <Input
                      startIcon={Mail}
                      type="email"
                      id="email"
                      disabled
                      readOnly
                      defaultValue={email}
                    />
                  </div>
                  {!isExistingUser && (
                    <Alert>
                      <Info />
                      <AlertTitle>Note</AlertTitle>
                      <AlertDescription>
                        Please save your password safely — you’ll need it to log
                        in or approve transactions.
                      </AlertDescription>
                    </Alert>
                  )}
                  {/* password */}
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="password" className="text-muted-foreground">
                      Password
                    </Label>
                    <Input
                      autoFocus
                      startIcon={KeyRound}
                      type="password"
                      id="password"
                      value={password}
                      placeholder="******"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {/* confirm password */}
                  {!isExistingUser && (
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label
                        htmlFor="confirm-password"
                        className="text-muted-foreground"
                      >
                        Confirm Password
                      </Label>
                      <Input
                        startIcon={KeyRound}
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        placeholder="******"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </CardContent>
        <CardFooter
          className={cn(
            "flex flex-col gap-4 px-6 pb-6",
            step === 2 && loading && "hidden"
          )}
        >
          {step === 0 && (
            <>
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
                disabled={!isEmailValid || loading}
                onClick={sendVerificationCode}
                className="w-full flex items-center justify-center gap-2"
              >
                Continue
                {loading && <Loader className="animate-spin" />}
                <ArrowRight className={cn(loading && "hidden")} />
              </Button>
            </>
          )}
          {step === 1 && (
            <Button
              variant="secondary"
              className="self-start"
              onClick={handleCancel}
              disabled={loading}
              size="sm"
            >
              Cancel
            </Button>
          )}
          {step === 2 && (
            <div className="self-stretch w-full flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={loading}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                disabled={
                  loading ||
                  password.length < 6 ||
                  (!isExistingUser && confirmPassword.length < 6)
                }
                onClick={handleLoginOrCreate}
              >
                {isExistingUser ? "Login" : "Create Account"}
                {isExistingUser ? <LogIn /> : <Rocket />}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
