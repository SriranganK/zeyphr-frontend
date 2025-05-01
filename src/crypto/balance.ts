import { ethers } from "ethers";

const rpcUrl = "https://json-rpc.evm.testnet.iotaledger.net/";

export const getWalletBalance = async (address: string) => {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const balance = await provider.getBalance(address);
  const balanceInEther = ethers.formatEther(balance);

  return balanceInEther;
};
