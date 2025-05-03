import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { truncateAddress } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "../../ui/badge";
import ToolTip from "../../tooltip";
import { DICEBEAR_API, EXPLORER_URL } from "@/data/app";
import {
  TransactionFromDB,
  TransactionFromExplorer,
  UserInfo,
} from "@/lib/types";
import { Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const TransactionCard: React.FC<TransactionCardProps> = ({
  tx,
  publicKey,
}) => {
  const isCredit =
    typeof tx.to !== "string" && tx.to.publicKey.toLowerCase() === publicKey;
  const otherPerson = (isCredit ? tx.from : tx.to) as Omit<UserInfo, "_id">;

  return (
    <ToolTip content="View transaction in explorer" hideOnMobile>
      <div className="hover:bg-accent rounded-xl px-3 py-1 mr-1.5">
        <a
          href={`${EXPLORER_URL}/tx/${tx.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-10">
                <AvatarImage src={`${DICEBEAR_API}=${otherPerson.publicKey}`} />
                <AvatarFallback>{otherPerson.username}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {isCredit ? "Received from" : "Sent to"}{" "}
                  <span className="font-semibold">{otherPerson.username}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {otherPerson.emailAddress}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(tx.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <div
                className={`text-lg font-semibold ${
                  isCredit ? "text-green-600" : "text-red-600"
                }`}
              >
                {isCredit ? "+" : "-"}
                {tx.amount} {tx.currency}
              </div>
              <StatusBadge status={tx.status} />
              <div className="text-xs text-muted-foreground">
                via {tx.paymentMethod.toUpperCase()}
              </div>
            </div>
          </div>
        </a>
      </div>
    </ToolTip>
  );
};

interface TransactionCardProps {
  tx: TransactionFromDB;
  publicKey: string;
}

const TransactionCardSkeleton: React.FC = () => (
  <div className="flex items-center justify-between px-3 py-1 mr-1.5">
    <div className="flex items-center gap-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-48 rounded-sm" />
        <Skeleton className="h-3 w-36 rounded-sm" />
        <Skeleton className="h-2 w-44 rounded-sm" />
      </div>
    </div>
    <div className="flex flex-col items-end space-y-1">
      <Skeleton className="h-7 w-16 rounded" />
      <Skeleton className="h-5 w-14 rounded-full" />
      <Skeleton className="h-3 w-10" />
    </div>
  </div>
);

export const TransactionsSkeleton: React.FC = () => (
  <>
    <TransactionCardSkeleton />
    <TransactionCardSkeleton />
    <TransactionCardSkeleton />
  </>
);

export const ExplorerTransactionCard: React.FC<
  ExplorerTransactionCardProps
> = ({ tx, publicKey }) => {
  const isCredit = tx.to.toLowerCase() === publicKey.toLowerCase();
  const otherPersonId = isCredit ? tx.from : tx.to;

  return (
    <ToolTip content="View transaction in explorer" hideOnMobile>
      <div className="hover:bg-accent rounded-xl px-3 py-1 mr-1.5">
        <a
          href={`${EXPLORER_URL}/tx/${tx.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-10">
                <AvatarImage src={`${DICEBEAR_API}=${otherPersonId}`} />
                <AvatarFallback>{otherPersonId}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {isCredit ? "Received" : "Sent"}{" "}
                </div>
                <div className="text-sm text-muted-foreground">
                  <ToolTip content={otherPersonId} hideOnMobile>
                    <span>{truncateAddress(otherPersonId, true)}</span>
                  </ToolTip>
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(
                    new Date(+tx.timestamp * 1000),
                    "MMM d, yyyy 'at' h:mm a"
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <div
                className={`text-lg font-semibold ${
                  isCredit ? "text-green-600" : "text-red-600"
                }`}
              >
                {isCredit ? "+" : "-"}
                {tx.amount} IOTA
              </div>
              <StatusBadge status="success" />
            </div>
          </div>
        </a>
      </div>
    </ToolTip>
  );
};

interface ExplorerTransactionCardProps {
  tx: TransactionFromExplorer;
  publicKey: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "success":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Success
        </Badge>
      );
    case "failure":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Failed
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
  }
};

interface StatusBadgeProps {
  status: TransactionFromDB["status"];
}
