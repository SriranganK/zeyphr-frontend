import axios from 'axios';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY!;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!;

export async function uploadImageToIPFS(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
    maxBodyLength: Infinity,
    headers: {
      'Content-Type': 'multipart/form-data',
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  });

  const ipfsHash = res.data.IpfsHash;
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
}

export async function uploadMetadataToIPFS(metadata: object) {
  const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
    headers: {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  });

  const ipfsHash = res.data.IpfsHash;
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
}