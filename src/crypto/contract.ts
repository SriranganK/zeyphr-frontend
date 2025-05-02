import { ethers } from "ethers";
import contractABI from "../data/abi.json";
import { CONTRACT_ADDRESS, RPC_URL } from "@/data/app";

export const getContract = () => {
  const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;

  if (typeof privateKey !== "string" || privateKey.length === 0) {
    throw new Error("Give Private key");
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

  return contract;
};
