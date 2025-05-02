import { getReadOnlyContract } from './contract';

export const getAvailableSupply = async (tokenId: number): Promise<number> => {
  try {
    const contract = getReadOnlyContract();
    const supply = await contract.getAvailableSupply(tokenId);
    return Number(supply);
  } catch (error) {
    console.error(error);
    return 0;
  }
};