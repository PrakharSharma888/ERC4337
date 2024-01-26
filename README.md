# Steps to Reproduce

This guide outlines the sequential steps to deploy a WalletFactory contract, create a smart wallet, and execute transactions using Ethereum smart contracts.

## Prerequisites

- Ensure access to Ethereum's Mumbai testnet.
- Install and configure the required libraries: npm i
- Add environment variables to `.env` file.

## Procedure

### Step 1: Deploy WalletFactory Contract

Deploy the WalletFactory contract using EntryPoint's contract address already deployed on the Mumbai testnet at `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`.

### Step 2: Generate Data for initCode

Create the initCode data by encoding the function `createAccount` from the WalletFactory contract with provided parameters (`owners` and `salt`).

### Step 3: Concatenate with WalletFactory Contract Address

Combine the generated initCode data with the WalletFactory contract address using the `concat` function.

### Step 4: Obtain Account Address

Retrieve the account address using `walletFactoryContract.getAddress(signers, salt)`, where `signers` represent the multi-signers of the wallet.

### Step 5: Access Wallet Contract Instance

Fetch the Wallet contract instance using the address obtained in the previous step with `getWalletContract(address)`.

### Step 6: Set Amount, ToAddress, and Fund the Smart Wallet

Specify the transaction amount, target address (`toAddress`), and fund the smart wallet contract as required.

### Step 7: Create UserOperation

Create UserOperation for both default (without signatures) and currentOp (with signatures) as per the transaction requirements.

### Step 8: Generate UserOperationHash

Generate the UserOperationHash using `getFinalUserOpHash(userOp)`.

### Step 9: Generate Signatures

Obtain signatures from signers for the UserOperationHash using `ethers.signTransaction(userOpHash)`.

### Step 10: Send UserOperation to Wallet Contract

Submit the UserOperation to the Wallet contract utilizing `client.sendUserOperation(builder)` for execution.

---

These steps outline the process for deploying contracts, creating UserOperations, and interacting with Ethereum smart contracts. Adjust parameters and contract addresses accordingly before execution. The code provided in the repository should be integrated into your project for execution.

For detailed implementation and specific code usage, refer to the provided code snippets in the repository.

---
