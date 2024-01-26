const { Contract, providers } = require("ethers");
const {
    BUNDLER_RPC_URL,
    ENTRY_POINT_ABI,
    WALLET_ABI,
    WALLET_FACTORY_ABI,
    WALLET_FACTORY_ADDRESS,
} = require("./constants.js");


const owners = [
    "0x8F0dfab18abE9241507C4d8746479cB9A2C966FA"
  ];

const provider = new providers.JsonRpcProvider(BUNDLER_RPC_URL);

// const salt = "0x" + randomBytes(32).toString("hex");

// console.log("Probably the second call with salt!", salt);
const walletFactoryContract = new Contract(
    WALLET_FACTORY_ADDRESS,
    WALLET_FACTORY_ABI,
    provider
);


const getWalletAddress = async (salt) => {
    const walletAddress = await walletFactoryContract.getAddress(owners, salt);
    console.log("this salt", salt);
    return walletAddress;
};

module.exports = {getWalletAddress}

 


 
