import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";

const QRScanner: React.FC<QRScannerProps> = ({ setQrValue }) => {
    const [open, setOpen] = useState<boolean>(true);
    const [data, setData] = useState<string>("");

    useEffect(() => {
        if (data.includes("zeyphr://qrpay")) {
            setQrValue(data);
            setOpen(false);
        }
    }, [data, setQrValue]);

    return (
        <Dialog open={open} onOpenChange={setOpen} defaultOpen>
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <QrCode />
                    Tap here to scan QR code
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Scan QR Code</DialogTitle>
                    <DialogDescription className="hidden" />
                </DialogHeader>
                <div className="flex w-full h-full border border-input rounded-xl overflow-hidden">
                    <BarcodeScanner
                        width="100%"
                        height="100%"
                        onUpdate={(_, result) => {
                            if (!open) return;
                            if (result) setData(result.getText());
                            else setData("");
                        }}
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};

export default QRScanner;

interface QRScannerProps {
    setQrValue: React.Dispatch<React.SetStateAction<string>>;
}
