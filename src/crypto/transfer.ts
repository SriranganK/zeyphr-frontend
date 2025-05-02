import { RPC_URL } from "@/data/app";
import { ethers } from "ethers";

export const transferEther = async (to: string, amountInEther: string, privateKey: string) => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);

  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amountInEther),
  });

  await tx.wait();

  return tx;
};
