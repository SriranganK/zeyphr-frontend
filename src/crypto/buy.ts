import { getContract } from './contract';

export const bulkBuyItems = async (tokenIds: number[]) => {
  try {
    const contract = getContract();
    const totalPrice = await contract.getBulkTotalPrice(tokenIds);
    const tx = await contract.purchaseItems(tokenIds, { value: totalPrice });
    const recipt =  await tx.wait();
    return recipt; 
  } catch (err) {
    console.error(err);
  }
};