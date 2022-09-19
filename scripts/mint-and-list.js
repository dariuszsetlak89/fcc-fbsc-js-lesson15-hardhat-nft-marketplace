const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { moveBlocks } = require("../utils/move-blocks");

const PRICE = ethers.utils.parseEther("0.1");

async function mintAndList() {
    const nftMarketplace = await ethers.getContract("NftMarketplace");
    const randomNumber = Math.floor(Math.random() * 2);
    let basicNft;
    if (randomNumber == 1) {
        basicNft = await ethers.getContract("BasicNft");
    } else {
        basicNft = await ethers.getContract("BasicNftTwo");
    }
    // Minting
    console.log("Minting NFT...");
    const mintTx = await basicNft.mintNft();
    const mintTxReceipt = await mintTx.wait(1);
    const tokenId = mintTxReceipt.events[0].args.tokenId;

    // Approving
    console.log("Approving NFT...");
    const approvalTx = await basicNft.approve(nftMarketplace.address, tokenId);
    await approvalTx.wait(1);

    // Listing
    console.log("Listing NFT...");
    const tx = await nftMarketplace.listItem(basicNft.address, tokenId, PRICE);
    await tx.wait(1);
    console.log("NFT Listed!");
    if (developmentChains.includes(network.name)) {
        // Moralis has a hard time if you move more than 1 at once!
        await moveBlocks(1, (sleepAmount = 1000));
    }
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
