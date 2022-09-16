require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-contract-sizer");
require("dotenv").config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const ETHEREUM_RPC_URL =
    process.env.ETHEREUM_MAINNET_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/<key>";
const GOERLI_RPC_URL =
    process.env.GOERLI_TESTNET_RPC_URL || "https://eth-goerli.g.alchemy.com/v2/<key>";
const POLYGON_RPC_URL =
    process.env.POLYGON_MAINNET_RPC_URL || "https://polygon-mainnet.g.alchemy.com/v2/<key>";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "PRIVATE_KEY";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "ETHERSCAN_API_KEY";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "POLYGONSCAN_API_KEY";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "COINMARKETCAP_API_KEY";
const CHAINLINK_VRF_SUB_ID = process.env.CHAINLINK_VRF_SUB_ID || "CHAINLINK_VRF_SUB_ID";
const REPORT_GAS = process.env.REPORT_GAS || false;
// const MNEMONIC = process.env.MNEMONIC || "MNEMONIC";
// const FORKING_BLOCK_NUMBER = 10000000; // modify

module.exports = {
    solidity: {
        compilers: [{ version: "0.8.9" }, { version: "0.6.6" }, { version: "0.4.24" }],
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            // forking: {
            //     url: ETHEREUM_RPC_URL,
            //     blockNumber: FORKING_BLOCK_NUMBER,
            //     enabled: true,
            // },
        },
        localhost: {
            chainId: 31337,
            url: "http://127.0.0.1:8545/",
            // accounts: given by Hardhat Network
            blockConfirmations: 1,
        },
        mainnet: {
            chainId: 1,
            url: ETHEREUM_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [`0x${PRIVATE_KEY}`] : [],
            // accounts: {
            //     mnemonic: MNEMONIC,
            // },
            saveDeployments: true,
        },
        goerli: {
            chainId: 5,
            url: GOERLI_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [`0x${PRIVATE_KEY}`] : [],
            saveDeployments: true,
            blockConfirmations: 6,
        },
        polygon: {
            chainId: 137,
            url: POLYGON_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [`0x${PRIVATE_KEY}`] : [],
            saveDeployments: true,
            chainId: 137,
        },
    },
    etherscan: {
        // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: {
            mainnet: ETHERSCAN_API_KEY,
            goerli: ETHERSCAN_API_KEY,
            polygon: POLYGONSCAN_API_KEY,
        },
    },
    gasReporter: {
        enabled: REPORT_GAS,
        outputFile: "gas-report.txt",
        currency: "USD",
        noColors: true,
        token: "ETH", // ETH (default), BNB, MATIC, AVAX
        // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
    contractSizer: {
        runOnCompile: false,
        only: ["APIConsumer", "KeepersCounter", "PriceConsumerV3", "RandomNumberConsumerV2"],
    },
    namedAccounts: {
        deployer: {
            default: 0, // deployer
        },
        user: {
            default: 1,
        },
    },
    mocha: {
        timeout: 100000, // 100000 ms = 100 s max for running tests
    },
};
