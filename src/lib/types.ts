export type CustomJwtPayload = {
    privateKey: string;
    publicKey: string;
    _id: string;
};

export type SearchResultUser = {
    _id: string;
    username: string;
    publicKey: string;
};

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
