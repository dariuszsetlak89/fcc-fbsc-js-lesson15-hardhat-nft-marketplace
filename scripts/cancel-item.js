const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");
const { developmentChains } = require("../helper-hardhat-config");

const TOKEN_ID = 1;

// Choose dogContractName:
// const dogContractName = "BasicNftDogPug";
const dogContractName = "BasicNftDogShibaInu";
// const dogContractName = "BasicNftDogStBernard";

async function cancel() {
    const nftMarketplace = await ethers.getContract("NftMarketplace");
    const basicNft = await ethers.getContract(dogContractName);
    const tx = await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID);
    await tx.wait(1);
    console.log(`NFT Canceled! TokenID: ${TOKEN_ID}, NFT address: ${basicNft.address}`);
    if (developmentChains.includes(network.name)) {
        await moveBlocks(2, (sleepAmount = 1000));
    }
}

cancel()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
