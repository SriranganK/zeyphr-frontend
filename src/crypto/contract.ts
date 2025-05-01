import { ethers } from "ethers";
import contractABI from "../data/abi.json";

const contractAddress = "0x3E0c7bCA0e9870658615C9871FAdead9a91fAA2B";
const rpcUrl = "https://json-rpc.evm.testnet.iotaledger.net";

export const getContract = () => {
  const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;

  if (typeof privateKey !== "string" || privateKey.length === 0) {
    throw new Error("Give Private key");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  return contract;
};
