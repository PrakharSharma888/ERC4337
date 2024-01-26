"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WALLET_ABI = exports.ENTRY_POINT_ABI = exports.WALLET_FACTORY_ABI = exports.BUNDLER_RPC_URL = exports.WALLET_FACTORY_ADDRESS = void 0;
exports.WALLET_FACTORY_ADDRESS = "0x108d802745e02763Db3084Dc5298834072c74392";
exports.BUNDLER_RPC_URL = "https://api.stackup.sh/v1/node/".concat(process.env.NEXT_PUBLIC_STACKUP_API_KEY);
exports.WALLET_FACTORY_ABI = [
    {
        inputs: [
            {
                internalType: "contract IEntryPoint",
                name: "entryPoint",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            {
                internalType: "address[]",
                name: "owners",
                type: "address[]",
            },
            {
                internalType: "uint256",
                name: "salt",
                type: "uint256",
            },
        ],
        name: "createAccount",
        outputs: [
            {
                internalType: "contract Wallet",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address[]",
                name: "owners",
                type: "address[]",
            },
            {
                internalType: "uint256",
                name: "salt",
                type: "uint256",
            },
        ],
        name: "getAddress",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "walletImplementation",
        outputs: [
            {
                internalType: "contract Wallet",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
exports.ENTRY_POINT_ABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                internalType: "uint192",
                name: "key",
                type: "uint192",
            },
        ],
        name: "getNonce",
        outputs: [
            {
                internalType: "uint256",
                name: "nonce",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
exports.WALLET_ABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "dest",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "func",
                type: "bytes",
            },
        ],
        name: "execute",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
