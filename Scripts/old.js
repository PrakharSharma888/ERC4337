// const { Contract, providers } = require("ethers");
// const { Constants, UserOperationBuilder } = require("userop");
// const { Client, Presets, IUserOperation } = require("userop");
// const { concat } = require("ethers/lib/utils");
// const { defaultAbiCoder, keccak256, parseEther } = require("ethers/lib/utils");
// const {
//   BUNDLER_RPC_URL,
//   ENTRY_POINT_ABI,
//   WALLET_ABI,
//   WALLET_FACTORY_ABI,
//   WALLET_FACTORY_ADDRESS,
// } = require("./constants.js");
// const { randomBytes } = require("crypto");
// const {
//   getSignature1,
//   getSignature2,
//   getSignature3,
//   getSignatureOwner,
// } = require("./getSignature.js");
// const { get } = require("http");
// // const {} = require("wagmi/chains");

// const amount = "0.001";
// // Convert the amount to a big integer
// const amountBigInt = parseEther(amount);
// let value = amountBigInt;


// const toAddress = "0x0DD6f366b539B049387981312a6D5379D583aE1C";

// var userOp;

// // Generate a random salt, convert it to hexadecimal, and prepend "0x"
// const salt = "0x" + randomBytes(32).toString("hex");
// // console.log(salt);

// // This needs to be an ethers provider because we will share this with `userop`
// const provider = new providers.JsonRpcProvider(BUNDLER_RPC_URL);

// const entryPointContract = new Contract(
//   Constants.ERC4337.EntryPoint,
//   ENTRY_POINT_ABI,
//   provider
// );

// const walletFactoryContract = new Contract(
//   WALLET_FACTORY_ADDRESS,
//   WALLET_FACTORY_ABI,
//   provider
// );

// const owners = [
//   "0x5aAB360f4eEC9C823175711d22D7D0C920D4481a",
//   "0x74f9478fbAD90e25371C32428bf21c439b91C865",
//   "0x91C3618a85aa1ed10eDE022335efD694054a4ecE",
// ];

// // Encode the function data for creating a new account
// const data = walletFactoryContract.interface.encodeFunctionData(
//   "createAccount",
//   [owners, salt]
// );
// let initCode = Uint8Array.from([]);
// // Initialize the initCode which will be used to deploy a new wallet
// initCode = concat([WALLET_FACTORY_ADDRESS, data]);

// const getWalletAddress = async () => {
//   const walletAddress = await walletFactoryContract.getAddress(owners, salt);
//   return walletAddress;
// };
// const walletAddress = getWalletAddress()

// const getWalletContract = (walletAddress) => {
//   return new Contract(walletAddress, WALLET_ABI, provider);
// };

// // console.log(walletFactoryContract);
// let walletContract = getWalletContract(walletAddress);
// const encodedCallData = walletContract.interface.encodeFunctionData("execute", [
//   toAddress,
//   value,
//   initCode,
// ]);


// // Get the wallet contract instance

// const getNonce = async () => {
//   const nonce = await entryPointContract.getNonce(
//     // why is this always returning zero??
//     walletAddress,
//     0
//   );
//   return nonce
// }
// const nonce = getNonce()

// const buidlerOp = async (
//   walletContract,
//   nonce,
//   initCode,
//   encodedCallData,
//   signatures
// ) => {
//   const encodedSignatures = defaultAbiCoder.encode(["bytes[]"], [signatures]);
//   // console.log("----", walletContract.address);
//   const builder = new UserOperationBuilder()
//     .useDefaults({
//       preVerificationGas: 100_000,
//       callGasLimit: 100_000,
//       verificationGasLimit: 2_000_000,
//     })
//     .setSender(walletContract.address)
//     .setNonce(nonce)
//     .setCallData(encodedCallData)
//     .setSignature(encodedSignatures)
//     .setInitCode(initCode);

//   return builder;
// };

// const getUserOpForETHTransfer = async () => {
//   const walletContract = getWalletContract(walletAddress);
//   // Get the user operation builder with the necessary parameters
//   const builder1 = await buidlerOp(
//     walletContract.address,
//     nonce,
//     initCode,
//     encodedCallData,
//     []
//   );

//   // Use middleware to set the current gas prices
//   builder1.useMiddleware(Presets.Middleware.getGasPrice(provider));

//   // Initialize a client to connect to the Bundler
//   const client = await Client.init(BUNDLER_RPC_URL);
//   // Build the user operation using the builder
//   await client.buildUserOperation(builder1);
//   // Retrieve the user operation
//   userOp = builder1.getOp();

//   return userOp;
// };

// // Get the user operation hash from the transaction
// const getUserOpHash = async () => {
//   const userOp = await getUserOpForETHTransfer();
//   console.log(userOp);
//   const encodedUserOp = defaultAbiCoder.encode(
//     [
//       "address",
//       "uint256",
//       "bytes32",
//       "bytes32",
//       "uint256",
//       "uint256",
//       "uint256",
//       "uint256",
//       "uint256",
//       "bytes32",
//     ],
//     [
//       userOp.sender,
//       userOp.nonce,
//       keccak256(userOp.initCode),
//       keccak256(userOp.callData),
//       userOp.callGasLimit,
//       userOp.verificationGasLimit,
//       userOp.preVerificationGas,
//       userOp.maxFeePerGas,
//       userOp.maxPriorityFeePerGas,
//       keccak256(userOp.paymasterAndData),
//     ]
//   );

//   // Encode the keccak256 hash with the address of the entry point contract and chainID
//   const encodedUserOpWithChainIdAndEntryPoint = defaultAbiCoder.encode(
//     ["bytes32", "address", "uint256"],
//     [keccak256(encodedUserOp), Constants.ERC4337.EntryPoint, "80001"]
//   );

//   // Return the keccak256 hash of the whole thing encoded
//   return keccak256(encodedUserOpWithChainIdAndEntryPoint);
// };

// const userOpHash = getUserOpHash();

// // console.log(walletAddress);

// const getSignature = async() => {
//   const signature = await getSignatureOwner(userOpHash);
//   console.log("-----",signature);
// }
// const signature = getSignature()



// // Get the nonce for the wallet address with a key of 0


// // console.log("-------",walletContract);
// // Use the UserOperationBuilder class to create a new builder
// // Supply the builder with all the necessary details to create a userOp



// const sendTransaction = async () => {
//   const userOp = transaction.userOp;

//   const client = await Client.init(BUNDLER_RPC_URL);
//   const orderedSignatures = []; // manual input

//   let initCode = userOp.initCode;
//   const builder = await buidlerOp(
//     userOp.sender,
//     BigNumber.from(userOp.nonce),
//     initCode,
//     userOp.callData.toString(),
//     orderedSignatures
//   );

//   // Set the maxFeePerGas and maxPriorityFeePerGas in the builder
//   builder
//     .setMaxFeePerGas(userOp.maxFeePerGas)
//     .setMaxPriorityFeePerGas(userOp.maxPriorityFeePerGas);

//   // Send the user operation and wait for the result
//   const result = await client.sendUserOperation(builder);
//   const finalUserOpResult = await result.wait();

//   const txHashReciept = await finalUserOpResult.getTransactionReceipt();
//   const txHash = txHashReciept.transactionHash;

//   console.log(txHash);
// };



// // console.log("2",getWalletContract());
