const { getWalletAddress } = require("./walletAddress");
const { getWalletContract } = require("./walletContract");
const { Contract, providers, utils } = require("ethers");
const { Constants, UserOperationBuilder } = require("userop");
const { Client, Presets, IUserOperation } = require("userop");
const { concat } = require("ethers/lib/utils");
const { defaultAbiCoder, keccak256, parseEther } = require("ethers/lib/utils");
const {
  BUNDLER_RPC_URL,
  WALLET_FACTORY_ABI,
  WALLET_FACTORY_ADDRESS,
} = require("./constants.js");
const { randomBytes } = require("crypto");
const { generateUserOpHash } = require("./userOpHash.js");
const { getSignature, wallet1 } = require("./opSignature.js");

let isDeployed = true; // 0x759A8003Ba7b3029b547b70E6890edFD776a3039

const provider = new providers.JsonRpcProvider(BUNDLER_RPC_URL);

const amount = "0.001";
// Convert the amount to a big integer
const amountBigInt = parseEther(amount);
let value = amountBigInt;

const walletFactoryContract = new Contract(
  WALLET_FACTORY_ADDRESS,
  WALLET_FACTORY_ABI,
  provider
);

const salt = "0x" + randomBytes(32).toString("hex");
// console.log("salt:",salt);

const owners = [
  "0x8F0dfab18abE9241507C4d8746479cB9A2C966FA",
];

const data = walletFactoryContract.interface.encodeFunctionData(
  "createAccount",
  [owners, salt]
);

const toAddress = "0x0DD6f366b539B049387981312a6D5379D583aE1C";
let initCode = Uint8Array.from([]);

initCode = concat([WALLET_FACTORY_ADDRESS, data]);

// console.log("initCode:  ",initCode);

const run = async () => {
  //   console.log("Maybe the first call with salt", salt);
  const walletAddress = await getWalletAddress(salt);
  //   console.log(walletAddress);
  // console.log("wallet address : ", walletAddress);
  const amountToSend = utils.parseEther("0.01"); // Replace with the desired amount
  async function sendEther() {
    const transaction = await wallet1.sendTransaction({
      to: walletAddress,
      value: amountToSend,
    });

    console.log("Transaction hash:", transaction.hash);
  }
  async function sleep (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  await sendEther();
  await sleep(15000);
  let walletContract = getWalletContract(walletAddress);
  // console.log("WalletContract --",walletContract);

  const encodedCallData = walletContract.interface.encodeFunctionData(
    "execute",
    [toAddress, value, initCode]
  );

  // const initCodeForMint721 = erc721.interface.encodeFunctionData( // ---- start here tomorrow ---
  //   "mint721",
  //   [toAddress, value, initCode]
  // );

  // console.log("Ye mila?",encodedCallData);
    
  const transaction = await generateUserOpHash(
    walletAddress,
    initCode,
    encodedCallData,
    isDeployed,
  );
    console.log(transaction);
};

run();
["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"]