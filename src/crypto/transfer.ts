import { ethers } from "ethers";

const rpcUrl = "https://json-rpc.evm.testnet.iotaledger.net/";

const privateKey =
  "d6d394608d8f53d8ff6b395170a0bf5c28a9739bf26a4ff40521708b6bcc9c7e";

export const transferEther = async (to: string, amountInEther: string) => {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amountInEther),
  });

  await tx.wait();

  return tx;
};
