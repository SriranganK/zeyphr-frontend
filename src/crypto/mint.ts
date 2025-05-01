import { uploadImageToIPFS, uploadMetadataToIPFS } from './pinata';
import { getContract } from './contract';
import { ethers } from "ethers";


export async function mintNFT(name: string, description: string, price: string, imageFile: File) {
  const imageURL = await uploadImageToIPFS(imageFile);
  console.log("Uploading image to IPFS...")
  console.log(imageURL)

  const metadata = {
    name,
    description,
    image: imageURL,
  };

  const tokenURI = await uploadMetadataToIPFS(metadata);
  console.log("Uploading Metadata to IPFS...")
  console.log(tokenURI)

  const contract = getContract()

  const tx = await contract.mintItem(tokenURI,ethers.parseEther(price));
  const receipt = await tx.wait();
  console.log("Minting NFT...",receipt)



  return { receipt, imageURL };
}