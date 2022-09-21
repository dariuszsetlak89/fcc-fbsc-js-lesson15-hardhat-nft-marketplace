const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("-------------------------------------------------------");

    // Deploy contract BasicNftDogPug
    let args = [];
    const basicNft1 = await deploy("BasicNftDogPug", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    // Deploy contract BasicNftDogShibaInu
    const basicNft2 = await deploy("BasicNftDogShibaInu", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    // Deploy contract BasicNftDogStBernard
    const basicNft3 = await deploy("BasicNftDogStBernard", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    // Verify deployed contracts on Etherscan
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(basicNft1.address, args);
    }
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(basicNft2.address, args);
    }
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(basicNft3.address, args);
    }

    log("-------------------------------------------------------");
};

module.exports.tags = ["all", "basicnft"];
