import { ethers } from "ethers";
import { getContract } from "./contract";

export const listItem = async (tokenId: number) => {
  const price = prompt("Enter price to list (in IOTA):");
  if (!price) return;

  try {
    const contract = getContract();
    const tx = await contract.listItem(tokenId, ethers.parseEther(price));
    await tx.wait();

    window.location.reload();
  } catch (error) {
    console.error("Error listing item:", error);
    alert("Failed to list item. See console for details.");
  }
};
