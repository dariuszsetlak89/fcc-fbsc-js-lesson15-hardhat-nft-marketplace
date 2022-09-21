const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");
const { developmentChains } = require("../helper-hardhat-config");

const TOKEN_ID = 30;

async function cancel() {
    const nftMarketplace = await ethers.getContract("NftMarketplace");
    const basicNft = await ethers.getContract("BasicNft");

    const tx = await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID);
    await tx.wait(1);
    console.log(`NFT Canceled! TokenID: ${TOKEN_ID}, NFT address: ${basicNft.address}`);
    if (developmentChains.includes(network.name)) {
        await moveBlocks(1, (sleepAmount = 1000));
    }
}

cancel()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
