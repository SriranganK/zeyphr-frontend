import { useEffect, useState } from "react";
import QRScanner from "./scanner";
import { UserInfo } from "@/lib/types";
import axios, { isAxiosError } from "axios";
import { useAppContext } from "@/context/app";
import { parseZeyphrQR } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DICEBEAR_API } from "@/data/app";
import { Button } from "@/components/ui/button";
import { Loader, Rocket } from "lucide-react";
import { toast } from "sonner";
import { celeberate } from "@/lib/confetti";

const ScanAndPay: React.FC = () => {
    const [qrValue, setQrValue] = useState<string>("");
    const { token } = useAppContext();
    const { postPwdCb, setPwdOpen } = useAppContext();
    const [fetching, setFetching] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false);
    const [paymentDetails, setPaymentDetails] = useState<{ user: UserInfo; amount: string }>();

    const handleCancel = () => {
        if (!paymentDetails) return;
        setPaymentDetails(undefined);
        setQrValue("");
    };

    const handleSend = () => {
        if (paymentDetails === undefined || sending || !postPwdCb) return;
        postPwdCb.current = (password: string) => {
            setSending(true);
            const sendTx = axios.post(
                "/transaction/new",
                {
                    to: paymentDetails.user.publicKey.toLowerCase(),
                    amount: paymentDetails.amount,
                    password,
                    paymentMethod: "wallet",
                    currency: "IOTA",
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.promise(sendTx, {
                loading: `Sending ${paymentDetails.amount} IOTA to "${paymentDetails.user.username}..."`,
                success: "Transaction successfull!!",
                error: "Transaction failed. Please try again.",
            });
            sendTx
                .then(() => {
                    setPaymentDetails(undefined);
                    setQrValue("");
                    celeberate();
                })
                .catch(err => {
                    if (isAxiosError(err)) {
                        if (err.response?.data.error === "Invalid credentials") {
                            toast.error("Transaction failed due to invalid credentials.");
                        }
                    }
                })
                .finally(() => setSending(false));
        };
        setPwdOpen!(true);
    };

    useEffect(() => {
        if (!qrValue.includes("zeyphr://qrpay")) return;
        const { publicKey: toPbKey, amount } = parseZeyphrQR(qrValue);
        if (!toPbKey) return;
        const fetchUser = async () => {
            try {
                setFetching(true);
                const { data } = await axios.get<UserInfo>(
                    `/users/fetch-user?query=${toPbKey}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setPaymentDetails({ user: data, amount });
            } finally {
                setFetching(false);
            }
        };
        fetchUser();
    }, [qrValue, token]);

    return <>
        {!qrValue
            ? <QRScanner setQrValue={setQrValue} /> :
            (
                <>
                    {fetching
                        ? <></> :
                        paymentDetails !== undefined && (<>
                            <p className="text-muted-foreground">Paying</p>
                            <p className="text-2xl font-semibold text-primary">{paymentDetails.amount} IOTA</p>
                            <p className="text-muted-foreground">to</p>
                            <div className="flex items-center gap-2">
                                <Avatar className="size-10">
                                    <AvatarImage
                                        src={`${DICEBEAR_API}=${paymentDetails.user.publicKey}`}
                                        alt={paymentDetails.user.username}
                                    />
                                    <AvatarFallback>{paymentDetails.user.username[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start min-w-0">
                                    <p className="text-sm font-medium truncate w-full">
                                        {paymentDetails.user.username}{" "}
                                    </p>
                                    <p className="text-sm font-medium truncate w-full text-muted-foreground">
                                        {paymentDetails.user.emailAddress}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <Button disabled={sending} variant="secondary" onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <Button disabled={sending} onClick={handleSend}>
                                    {sending ? <Loader className="animate-spin" /> : <Rocket />}
                                    Send
                                </Button>
                            </div>
                        </>)}
                </>
            )}
    </>;
};

export default ScanAndPay;
