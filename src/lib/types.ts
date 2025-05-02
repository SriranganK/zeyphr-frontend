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
    buyer: string;
    sold: boolean;
    listed: boolean;
    tokenURI: string;
    image: string;
    name: string;
    desc: string;
    availableSupply: number;
}
