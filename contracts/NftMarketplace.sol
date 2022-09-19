// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// 1. `listItem`: List NFTs on the marketplace ✅
// 2. `buyItem`: Buy the NFTs ✅
// 3. `cancelItem`: Cancel a listing ✅
// 4. `updateListening`: Update Price ✅
// 5. `withdrawProceeds`: Withdraw payment for my bought NFTs ✅

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NftMarketplace__PriceMustBeAboveZero();
error NftMarketplace__NotAprovedForMarketplace();
error NftMarketplace__NotOwner();
error NftMarketplace__AlreadyListed(address nftAddress, uint256 tokenId);
error NftMarketplace__NotListed(address nftAddress, uint256 tokenId);
error NftMarketplace__PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error NftMarketplace__NoProceeds();
error NftMarketplace__TransferFailed();

contract NftMarketplace is ReentrancyGuard {
    struct Listing {
        uint256 price;
        address seller;
    }

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    // NFT Contract address -> NFT TokenID -> Listing
    mapping(address => mapping(uint256 => Listing)) private s_listings;

    // Seller address -> Amount earned
    mapping(address => uint256) private s_proceeds;

    //////////////////
    //   Modifiers  //
    //////////////////

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NftMarketplace__NotOwner();
        }
        _;
    }

    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        // Check if listing price is > 0 - item already listed
        if (listing.price > 0) {
            revert NftMarketplace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        // Check if listing price is <= 0 - item not yet listed
        if (listing.price <= 0) {
            revert NftMarketplace__NotListed(nftAddress, tokenId);
        }
        _;
    }

    ////////////////////
    // Main Functions //
    ////////////////////

    /*
     * @notice Method for listing your NFT on the marketplace
     * @param nftAddress: Address of NFT contract
     * @param tokenId: The Token ID of the NFT
     * @param price: Sale price of the listed NFT
     * @dev Technically, we could have the contract be the escrow for the NFTs
     * but this way people can still hold their NFTs when listed.
     */
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        notListed(nftAddress, tokenId, msg.sender)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        // Check if price set for item we want to list is > 0
        if (price <= 0) {
            revert NftMarketplace__PriceMustBeAboveZero();
        }
        // There are two ways to list item on the marketplace:
        // 1. Send the NFT to the contract. Transfer -> Contract "hold" the NFT.
        // 2. Owners can still hold their NFT, and give the marketplace approval to sell the NFT for them.
        // We have chosen second option.
        IERC721 nft = IERC721(nftAddress);
        // Check if nft item is approved for listing in marketplace
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketplace__NotAprovedForMarketplace();
        }
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        // The best practise to update mappings is to emit an event
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    // Challenge: Have this contract accept payment in a subset of tokens as well
    // Hint: Use Chainlink Price Feeds to convert the price of the tokens between each other
    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        nonReentrant
        isListed(nftAddress, tokenId)
    {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        // Check if sent value met the item price
        if (msg.value < listedItem.price) {
            revert NftMarketplace__PriceNotMet(nftAddress, tokenId, listedItem.price);
        }
        // Update seller account by sold item price - update mapping s_proceeds
        s_proceeds[listedItem.seller] = s_proceeds[listedItem.seller] += msg.value;
        // Delete bought item listing - remove a mapping from array
        delete (s_listings[nftAddress][tokenId]);
        // Transfer NFT item to buyer address
        // We don't just send the seller the money...?
        // https://fravoll.github.io/solidity-patterns/pull_over_push.html
        // Sending the money to the user ❌ NOT SAFE
        // Have them withdraw the money ✅ SAFE
        IERC721 nft = IERC721(nftAddress);
        nft.safeTransferFrom(listedItem.seller, msg.sender, tokenId); // frunction safeTransferFrom is safer than transferFrom
        // Check to make sure the NFT was transfered
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete (s_listings[nftAddress][tokenId]);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    ) external isListed(nftAddress, tokenId) isOwner(nftAddress, tokenId, msg.sender) {
        s_listings[nftAddress][tokenId].price = newPrice;
        // Updating listed item is essentialy the same as relisting this item - we can use the same event ItemListed
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert NftMarketplace__NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if (!success) {
            revert NftMarketplace__TransferFailed();
        }
    }

    //////////////////////
    // Getter Functions //
    //////////////////////

    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }
}
