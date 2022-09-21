const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { moveBlocks } = require("../utils/move-blocks");

const PRICE = ethers.utils.parseEther("0.1");
const NUMBER_OF_ITEMS = 10;

async function mintAndList() {
    const nftMarketplace = await ethers.getContract("NftMarketplace");

    for (let i = 1; i <= NUMBER_OF_ITEMS; i++) {
        const randomNumber = Math.floor(Math.random() * 3) + 1;
        // console.log(randomNumber);
        let basicNft, randomChosenNFT;
        switch (randomNumber) {
            case 1: {
                basicNft = await ethers.getContract("BasicNftDogPug");
                randomChosenNFT = "Pug";
                break;
            }
            case 2: {
                basicNft = await ethers.getContract("BasicNftDogShibaInu");
                randomChosenNFT = "Shiba Inu";
                break;
            }
            case 3: {
                basicNft = await ethers.getContract("BasicNftDogStBernard");
                randomChosenNFT = "St. Bernard";
                break;
            }
            default:
                console.log("Error! No matching contract.");
        }

        // Minting
        // console.log("Minting NFT...");
        const mintTx = await basicNft.mintNft();
        const mintTxReceipt = await mintTx.wait(1);
        const tokenId = mintTxReceipt.events[0].args.tokenId;

        // Approving
        // console.log("Approving NFT...");
        const approvalTx = await basicNft.approve(nftMarketplace.address, tokenId);
        await approvalTx.wait(1);

        // Listing
        // console.log("Listing NFT...");

        const RANDOM_PRICE = ethers.utils.parseEther(
            Math.floor(Math.random() * 100 + 1).toString()
        );
        // Listing price: PRICE or RANDOM_PRICE
        const tx = await nftMarketplace.listItem(basicNft.address, tokenId, RANDOM_PRICE);
        await tx.wait(1);

        // console.log(`NFT minted, approved and listed!`);
        console.log(
            `Minted NFT: ${randomChosenNFT}, Listing price: ${ethers.utils.formatEther(
                RANDOM_PRICE
            )} ETH, TokenID: ${tokenId}, NFT address: ${basicNft.address}`
        );
    }

    // Mining blocks on local network
    if (developmentChains.includes(network.name)) {
        // Moralis has a hard time if you move more than 1 at once!
        await moveBlocks(2, (sleepAmount = 1000));
    }
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
