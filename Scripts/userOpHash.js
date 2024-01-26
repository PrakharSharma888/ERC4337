const { Contract, providers, BigNumber } = require("ethers");
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

const { getWalletContract } = require("./walletContract");
const { getSignature } = require("./opSignature.js");

const provider = new providers.JsonRpcProvider(BUNDLER_RPC_URL);

const entryPointContract = new Contract(
  Constants.ERC4337.EntryPoint,
  ENTRY_POINT_ABI,
  provider
);
// console.log("What is this?",Constants.ERC4337.EntryPoint);

const generateUserOpHash = async (
  walletAddress,
  initCode,
  encodedCallData,
  isDeployed
) => {
  // const walletAddress = await getWalletAddress();

  const getNonce = async () => {
    // console.log("Entry point contract",entryPointContract);
    const nonce = await entryPointContract.getNonce(
      // why is this always returning zero??
      walletAddress,
      0
    );
    return nonce;
  };
  const nonce = await getNonce();
  // console.log("Nonce?",nonce);

  const buidlerOp = async (
    walletContract,
    nonce,
    initCode,
    encodedCallData,
    signatures
  ) => {
    const encodedSignatures = defaultAbiCoder.encode(["bytes[]"], [signatures]);

    // console.log("----", walletContract);
    // console.log("----", nonce);
    // console.log("Oh nooooo ++++",walletContract);
    const builder = new UserOperationBuilder()
      .useDefaults({
        preVerificationGas: 200_000,
        callGasLimit: 200_000,
        verificationGasLimit: 3_000_000,
      })
      .setSender(walletContract)
      .setNonce(nonce)
      .setCallData(encodedCallData)
      .setSignature(encodedSignatures)
      .setInitCode(initCode);

    return builder;
  };

  const getUserOpForETHTransfer = async () => {
    // khali vala builder
    // console.log("walletAddress he kya esper?",walletAddress);
    const walletContract = getWalletContract(walletAddress);
    // Get the user operation builder with the necessary parameters
    const builder1 = await buidlerOp(
      walletContract.address,
      nonce,
      initCode,
      encodedCallData,
      []
    );

    // Use middleware to set the current gas prices
    builder1.useMiddleware(Presets.Middleware.getGasPrice(provider));

    // Initialize a client to connect to the Bundler
    const client = await Client.init(BUNDLER_RPC_URL);
    // Build the user operation using the builder
    await client.buildUserOperation(builder1);
    // Retrieve the user operation
    let userOp = builder1.getOp();

    return userOp;
  };

  // const getUserOpHash = async () => {
  //   const userOp = await getUserOpForETHTransfer();
  //   console.log("Who is this number 1 sender", userOp.sender);
  //   // console.log(userOp);
  //   // console.log("Kon he be?",userOp.sender); // 0x2Df3346aD69F09C0FEEE5f8fD8cbd13a74FB11C9
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
  //     // console.log("Ye chalra he kya?",encodedUserOp);
  //   // Encode the keccak256 hash with the address of the entry point contract and chainID
  //   const encodedUserOpWithChainIdAndEntryPoint = defaultAbiCoder.encode(
  //     ["bytes32", "address", "uint256"],
  //     [keccak256(encodedUserOp), Constants.ERC4337.EntryPoint, 80001]
  //   );

  //   // Return the keccak256 hash of the whole thing encoded
  //   return keccak256(encodedUserOpWithChainIdAndEntryPoint);
  // };

  const getFinalUserOpHash = async (userOp) => {
    const encodedUserOp = defaultAbiCoder.encode(
      [
        "address",
        "uint256",
        "bytes32",
        "bytes32",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "bytes32",
      ],
      [
        userOp.sender,
        userOp.nonce,
        keccak256(userOp.initCode),
        keccak256(userOp.callData),
        userOp.callGasLimit,
        userOp.verificationGasLimit,
        userOp.preVerificationGas,
        userOp.maxFeePerGas,
        userOp.maxPriorityFeePerGas,
        keccak256(userOp.paymasterAndData),
      ]
    );

    // Encode the keccak256 hash with the address of the entry point contract and chainID
    const encodedUserOpWithChainIdAndEntryPoint = defaultAbiCoder.encode(
      ["bytes32", "address", "uint256"],
      [keccak256(encodedUserOp), Constants.ERC4337.EntryPoint, 80001]
    );
    // console.log("Entry point",Constants.ERC4337.EntryPoint);
    // console.log("uske badka ",encodedUserOpWithChainIdAndEntryPoint);
    // Return the keccak256 hash of the whole thing encoded
    return keccak256(encodedUserOpWithChainIdAndEntryPoint);
  };

  // const hash = await getUserOpHash(); // hash nahi use kiya abhi tak hmmmmm...

  const userOp2 = await getUserOpForETHTransfer();
  console.log("userOp:  ", userOp2);
  const userOp2Hash = await getFinalUserOpHash(userOp2);
  console.log("UserOp hash", userOp2Hash);
  const signature = await getSignature(userOp2Hash);
  // console.log(signature);
  // const userOp = transaction.userOp;

  const client = await Client.init(BUNDLER_RPC_URL);
  // const orderedSignatures = []; // manual input

  let initCode2 = userOp2.initCode;
  // console.log("22222 ---- ",initCode2);
  // console.log("Who is this number 2 sender? ",userOp2.sender); // Yes they are same
  const builder = await buidlerOp(
    userOp2.sender,
    BigNumber.from(userOp2.nonce),
    initCode2,
    userOp2.callData.toString(),
    signature
  );

  // Set the maxFeePerGas and maxPriorityFeePerGas in the builder
  builder
    .setMaxFeePerGas(userOp2.maxFeePerGas)
    .setMaxPriorityFeePerGas(userOp2.maxPriorityFeePerGas);

  //   console.log("builder",builder);
  console.log("Done");
  console.log("Builderrrrrrr-----", builder);
  // Send the user operation and wait for the result
  // let contractVa = getWalletContract(walletAddress);
  // let res = await contractVa.validateSignature(userOp2, userOp2Hash);
  // console.log("Valid?", red);
  const result = await client.sendUserOperation(builder);
  console.log("result: ", result);

  const finalUserOpResult = await result.wait();
  console.log("Final Parcha",finalUserOpResult);
  const txHashReciept = await finalUserOpResult.getTransactionReceipt();
  const txHash = txHashReciept.transactionHash;
  isDeployed = true;
    console.log(result);

  return txHash;
};

module.exports = { generateUserOpHash };
