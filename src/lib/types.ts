export type CustomJwtPayload = {
    publicKey: string;
};

export type UserInfo = {
    _id: string;
    username: string;
    emailAddress: string;
    publicKey: string;
}

export type SearchResultUser = Omit<UserInfo, "_id">;

export type HomePageItem = {
    tokenId: number;
    price: string;
    seller: string;
    listed: boolean;
    tokenURI: string;
    image: string;
    name: string;
    description: string;
    availableSupply: number;
}

export type ItemMetaData = {
    name: string;
    description: string;
    image: string;
};

export type TransactionFromDB = {
    id: string;
    txHash: string;
    from: "" | Omit<UserInfo, "_id">;
    to: "" | Omit<UserInfo, "_id">;
    amount: number;
    currency: "IOTA";
    paymentMethod: "qr" | "card" | "wallet";
    status: "success" | "failure" | "pending";
    createdAt: string;
    updatedAt: string;
};

export type ExplorerTx = {
    blockHash: string;
    blockNumber: string;
    confirmations: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    from: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    hash: string;
    input: string;
    isError: string;
    nonce: string;
    timeStamp: string;
    to: string;
    transactionIndex: string;
    txreceipt_status: string;
    value: string;
};

export type TransactionFromExplorer = {
    txHash: string;
    from: string;
    to: string;
    amount: string;
    timestamp: string;
};
