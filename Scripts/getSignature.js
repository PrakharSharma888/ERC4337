// const {
//   BUNDLER_RPC_URL,
//   ENTRY_POINT_ABI,
//   WALLET_ABI,
//   WALLET_FACTORY_ABI,
//   WALLET_FACTORY_ADDRESS,
// } = require("./constants.js");
// const { Contract, providers, Wallet } = require("ethers");
// require("dotenv").config();

// const provider = new providers.JsonRpcProvider(
//   "https://polygon-mumbai-bor.publicnode.com"
// );

// const wallet1 = new Wallet(process.env.pk1, provider);
// const wallet2 = new Wallet(process.env.pk2, provider);
// const wallet3 = new Wallet(process.env.pk3, provider);
// const ownerWallet = new Wallet(process.env.PRIVATE_KEY, provider)

 

// const getSignature1 = async (userOpHash) => {
//   const signature1 = await wallet1.signMessage(userOpHash);
//   console.log(signature1);
//   return signature1;
// };
// const getSignature2 = async (userOpHash) => {
//   const signature1 = await wallet2.signMessage(userOpHash);
//   console.log(signature1);
//   return signature1;
// };
// const getSignature3 = async (userOpHash) => {
//   const signature1 = await wallet3.signMessage(userOpHash);
//   console.log(signature1);
//   return signature1;
// };
// const getSignatureOwner = async (userOpHash) => {
//     const signature1 = await ownerWallet.signMessage(userOpHash);
//     console.log(signature1);
//     return signature1;
//   };

//   module.exports = {getSignature1, getSignature2, getSignature3, getSignatureOwner}
// // getSignature(wallet1);
// // getSignature(wallet2);
// // getSignature(wallet3);
