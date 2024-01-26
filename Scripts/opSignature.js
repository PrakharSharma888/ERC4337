const {
    BUNDLER_RPC_URL,
    ENTRY_POINT_ABI,
    WALLET_ABI,
    WALLET_FACTORY_ABI,
    WALLET_FACTORY_ADDRESS,
  } = require("./constants.js");
  const { Contract, providers, Wallet, utils } = require("ethers");
  require("dotenv").config();
  
  const provider = new providers.JsonRpcProvider(
    "https://polygon-mumbai-bor.publicnode.com"
  );


  const wallet1 = new Wallet(process.env.PRIVATE_KEY, provider);
  const wallet2 = new Wallet(process.env.pk1, provider);
  const wallet3 = new Wallet(process.env.pk2, provider);

  const getSignature = async (userOpHash) => {
    const signature1 = await wallet1.signMessage(utils.arrayify(userOpHash));
    const signature2 = await wallet2.signMessage(userOpHash);
    const signature3 = await wallet3.signMessage(userOpHash);
    console.log(signature1);
    return [signature1];    
   
  }; 

  // const getWallet = async() => {
  //   return wallet1
  // }
 

  module.exports = { getSignature, wallet1 }