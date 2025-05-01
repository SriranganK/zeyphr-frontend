import { getContract } from "./contract";

export const unlistItem = async (tokenId: number) => {
  try {
    const contract = getContract();
    const tx = await contract.unlistItem(tokenId);
    await tx.wait();

    window.location.reload();
  } catch (error) {
    console.error("Error unlisting item:", error);
    alert("Failed to unlist item. See console for details.");
  }
};
