import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

const ScanAndPay: React.FC = () => {
    return <>
        <Button variant="ghost">
            <QrCode />
            Tap here to scan QR code
        </Button>
    </>;
};

export default ScanAndPay;
