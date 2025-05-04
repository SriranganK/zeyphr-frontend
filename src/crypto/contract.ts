import { ethers } from "ethers";
import contractABI from "../data/abi.json";
import { CONTRACT_ADDRESS, RPC_URL } from "@/data/app";

export const getReadOnlyContract = () => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
  return contract;
};
