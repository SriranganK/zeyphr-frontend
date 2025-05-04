import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { CustomJwtPayload, UserInfo } from "@/lib/types";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useAppContext } from "@/context/app";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { AtSign, Check, Mail, RotateCcw } from "lucide-react";
import ToolTip from "../tooltip";

const ManageProfile: React.FC<ManageProfileProps> = ({ open, setOpen }) => {
    const { token } = useAppContext();
    const publicKey = (
        jwtDecode(token) as CustomJwtPayload
    ).publicKey.toLowerCase();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [, setFetching] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [, setUpdating] = useState<boolean>(false);

    const updateUsername = () => {
        try {
            setUpdating(true);
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setFetching(true);
                const { data } = await axios.get<UserInfo>(
                    `/users/fetch-user?query=${publicKey}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setUserInfo(data);
                setUsername(data.username);
                setEmail(data.emailAddress);
            } finally {
                setFetching(false);
            }
        };
        fetchUser();
    }, [publicKey, token]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage Profile</DialogTitle>
                    <DialogDescription>Manage your account details — update your username and email address. Password update coming soon.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    {/* username */}
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="username" className="text-muted-foreground">
                            Username
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="username"
                                name="username"
                                startIcon={AtSign}
                                placeholder="@john-doe"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                            {username !== userInfo?.username && <>
                                <ToolTip content="Update">
                                    <Button size="icon" disabled={username === userInfo?.username} onClick={updateUsername}><Check /></Button></ToolTip>
                                <ToolTip content="Cancel change">
                                    <Button size="icon" variant="secondary" onClick={() => setUsername(userInfo?.username ?? "")}><RotateCcw /></Button></ToolTip>
                            </>}
                        </div>
                    </div>
                    {/* emailAddress */}
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email" className="text-muted-foreground">
                            Email
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                startIcon={Mail}
                                placeholder="john.doe@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            {email !== userInfo?.emailAddress && <>
                                <ToolTip content="Update">
                                    <Button size="icon" disabled={email === userInfo?.emailAddress}><Check /></Button></ToolTip>
                                <ToolTip content="Cancel change">
                                    <Button size="icon" variant="secondary" onClick={() => setEmail(userInfo?.emailAddress ?? "")}><RotateCcw /></Button></ToolTip>
                            </>}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ManageProfile;

interface ManageProfileProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
