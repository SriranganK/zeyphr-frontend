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
