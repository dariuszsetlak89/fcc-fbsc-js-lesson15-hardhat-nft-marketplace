const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { moveBlocks } = require("../utils/move-blocks");

const PRICE = ethers.utils.parseEther("0.1");

async function mint() {
    const randomNumber = Math.floor(Math.random() * 3);
    // console.log(randomNumber);
    let basicNft, randomChosenNFT;
    switch (randomNumber) {
        case 0: {
            basicNft = await ethers.getContract("BasicNftDogPug");
            randomChosenNFT = "Dog Pug";
            break;
        }
        case 1: {
            basicNft = await ethers.getContract("BasicNftDogShibaInu");
            randomChosenNFT = "Dog Shiba Inu";
            break;
        }
        case 2: {
            basicNft = await ethers.getContract("BasicNftDogStBernard");
            randomChosenNFT = "Dog St. Bernard";
            break;
        }
        default:
            console.log("Error! No matching contract.");
    }

    // Minting
    console.log("Minting NFT...");
    const mintTx = await basicNft.mintNft();
    const mintTxReceipt = await mintTx.wait(1);
    const tokenId = mintTxReceipt.events[0].args.tokenId;
    console.log(`NFT minted!`);
    console.log(
        `Minted NFT: ${randomChosenNFT}, TokenID: ${tokenId}, NFT address: ${basicNft.address}`
    );

    // Mining blocks on local network
    if (developmentChains.includes(network.name)) {
        // Moralis has a hard time if you move more than 1 at once!
        await moveBlocks(2, (sleepAmount = 1000));
    }
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
