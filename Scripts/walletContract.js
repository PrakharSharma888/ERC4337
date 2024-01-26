
const { Contract, providers } = require("ethers");
const { Constants, UserOperationBuilder } = require("userop");
const { Client, Presets, IUserOperation } = require("userop");
const { concat } = require("ethers/lib/utils");
const { defaultAbiCoder, keccak256, parseEther } = require("ethers/lib/utils");
const {
    BUNDLER_RPC_URL,
    ENTRY_POINT_ABI,
    WALLET_ABI,
    WALLET_FACTORY_ABI,
    WALLET_FACTORY_ADDRESS,
} = require("./constants.js");
const { randomBytes } = require("crypto");
const {
    getSignature1,
    getSignature2,
    getSignature3,
    getSignatureOwner,
} = require("./getSignature.js");
const { get } = require("http");
const { getWalletAddress } = require("./walletAddress.js");

const provider = new providers.JsonRpcProvider(BUNDLER_RPC_URL);

const getWalletContract = (walletAddress) => {
    return new Contract(walletAddress, WALLET_ABI, provider);
};

module.exports = { getWalletContract }
