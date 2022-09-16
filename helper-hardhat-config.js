const networkConfig = {
    default: {
        name: "hardhat",
        mintFee: "10000000000000000", // 0.01 ETH
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // gasLane
        fundAmount: "1000000000000000000", // 1 ETH
        keepersUpdateInterval: "30", // seconds
    },
    31337: {
        name: "localhost",
        mintFee: "10000000000000000", // 0.01 ETH
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // gasLane
        fundAmount: "1000000000000000000", // 1 ETH
        keepersUpdateInterval: "30", // seconds
    },
    1: {
        name: "mainnet",
        linkToken: "0x514910771af9ca656af840dff83e8264ecf986ca",
        fundAmount: "0",
        keepersUpdateInterval: "30", // seconds
    },
    5: {
        name: "goerli",
        linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        keyHash: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // gasLane
        callbackGasLimit: "50000", // 500,000 gas
        mintFee: "10000000000000000", // 0.01 ETH
        fundAmount: "100000000000000000", // 0.1
        subscriptionId: "VRF_SUBSCRIPTION_ID",
        keepersUpdateInterval: "30", // seconds
    },
    137: {
        name: "polygon",
        linkToken: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
        fee: "100000000000000",
        fundAmount: "100000000000000",
    },
};

const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
};
