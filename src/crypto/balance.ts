import { RPC_URL } from "@/data/app";
import { ethers } from "ethers";

export const getWalletBalance = async (address: string) => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const balance = await provider.getBalance(address);
  const balanceInEther = ethers.formatEther(balance);

  return balanceInEther;
};
