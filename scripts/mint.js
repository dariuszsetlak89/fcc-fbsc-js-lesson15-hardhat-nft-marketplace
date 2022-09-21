const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { moveBlocks } = require("../utils/move-blocks");

const PRICE = ethers.utils.parseEther("0.1");

async function mint() {
    const randomNumber = Math.floor(Math.random() * 2);
    let basicNft, randomChosenNFT;
    if (randomNumber == 1) {
        basicNft = await ethers.getContract("BasicNftTwo");
        randomChosenNFT = "BasicNftTwo";
    } else {
        basicNft = await ethers.getContract("BasicNftTwo");
        randomChosenNFT = "BasicNftTwo";
    }

    // Minting
    console.log("Minting NFT...");
    const mintTx = await basicNft.mintNft();
    const mintTxReceipt = await mintTx.wait(1);
    const tokenId = mintTxReceipt.events[0].args.tokenId;
    console.log(`NFT minted!`);
    console.log(`Random chosen NFT contract: ${randomChosenNFT}`);
    console.log(`TokenID: ${tokenId}`);
    console.log(`NFT address: ${basicNft.address}`);
    console.log(
        `Minted tokenId ${mintTxReceipt.events[0].args.tokenId.toString()} from contract: ${
            basicNft.address
        }`
    );

    // Mining blocks on local network
    if (developmentChains.includes(network.name)) {
        // Moralis has a hard time if you move more than 1 at once!
        await moveBlocks(1, (sleepAmount = 1000));
    }
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
