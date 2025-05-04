# Zeyphr – Bringing Web3 to Everyone
![Zeyphr Logo](https://res.cloudinary.com/dezo0vvpb/image/upload/v1746361459/WhatsApp_Image_2025-04-09_at_5.09.11_PM_hyxsn5.jpg)

Zeyphr is a decentralized Web3 marketplace and crypto-native payment platform built using the IOTA EVM. It enables users and businesses to transact seamlessly, both online and offline, with familiar Web2-like user experiences—email logins, one-tap payments, QR scan, and more—while abstracting away the blockchain complexities underneath.

---

## 📂 Related Repositories

> 🔗 This repository contains the **Front end code** for Zeyphr.

You can find the rest of the Zeyphr project codes here:

- 🖥️ **POS Machine:**
    [github.com/SriranganK/zeyphr/tree/main/pos_machine](https://bit.ly/zeyphr-pos)

- 🛠️ **Back End:**
    [github.com/SriranganK/zeyphr-backend](https://bit.ly/zeyphr-backend)

- 📜 **Smart Contracts:**
    [github.com/nikhilkxmar/zeyphr-contract](https://bit.ly/zeyphr-contract)

---

## 🔨 Setup

Your `.env` file should look something like this.

```
VITE_API_ENDPOINT="YOUR-BASE-BACK-END-URL/api"
VITE_DICEBEAR_API=https://api.dicebear.com/9.x/identicon/svg?seed
VITE_FAUCET_LINK=https://evm-toolkit.evm.testnet.iotaledger.net/
VITE_RPC_URL=https://json-rpc.evm.testnet.iotaledger.net/
VITE_CONTRACT_ADDRESS="YOUR-DEPLOYED-CONTRACT-ADDRESS"
VITE_EXPLORER_URL=https://explorer.evm.testnet.iotaledger.net
```

---

## ⚽ Usage

```
1. npm install
2. npm run dev
3. npm run build (to build the code)
```

---

## 🚀 Live Demo

🔗 [Try Zeyphr Now](https://zeyphr.netlify.app/)

> Create your account and experience the future of decentralized commerce with **Zeyphr**
---


## 🧠 About Zeyphr

Zeyphr is our submission to the IOTA Movethon under the **Payments & Consumer Applications** track. Our Mission is Web3 ecommerce gateway that removes the complexity of blockchain. From email-password logins to universal tap-and-pay, QR pay Zeyphr enables anyone to buy, sell, and transact — online or offline - Just like Web2 !!

---

## ✨ Features

- 🪪 **Web2-style Login:** Email + Password with Email OTP; wallets are abstracted from the user.

- 📲 **Tap & Pay:** NFC-based crypto payments via physical Zeyphr card with in-store POS devices.
- 🔍 **Scan & Pay:** QR-based payments available on web and in-store POS devices.
- 🔐 **Secure Wallet Management:** Private keys are encrypted using user credentials and stored securely.
- 🛒 **Decentralized Marketplace:** Buy & sell physical and digital products online or in-store.

---
## 🏗 Architecture

![Zeyphr Architecture](https://res.cloudinary.com/dezo0vvpb/image/upload/v1746361408/zeyphr_arch_bnwsbz.jpg)

---
## 🛠️ Tech Stack

- **Frontend:** ReactJS , Shadcn, ethers.js
- **Backend:** Node.js with Express , Flask
- **Database:** MongoDB
- **Blockchain:** IOTA EVM, Solidity, Pinata(IPFS)
- **POS Machine**: IOT, Python, Shell Script, ReactJS
- **POS Hardware**: Raspberry Pi 5, Display(XPT2046), NFC Sensor(PN532)