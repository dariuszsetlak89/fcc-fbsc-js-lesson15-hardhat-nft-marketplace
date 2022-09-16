# [Project name]

#### Template version: 1.0
#### Date of creation: 16.09.22
#### Latest update: 16.09.22

-----------------------------------------------------------------------------------

# Getting started

## 1. Copy template repository on Github by clicking: `Use this template` button

## 2. Copy repository from GitHub to your local folder

```
git clone git@github.com:dariuszsetlak89/[new-project-name].git
```
or
```
git clone https://github.com/dariuszsetlak89/[new-project-name].git
```

## 3. Enter the project folder and open project in new VS Code WSL: Ubuntu window

1) New project path:
```
~/PROJECTS/[new-project-path]
```
2) Open command:
```
cd [new-project-path]
code .
```

## 4a. Install all packages
1) Install all packages from package.json with yarn.lock:
```
yarn
```

or

## 4b. Update all packages to newest versions

1) Delete files `package.json` and `yarn.lock` using command:
```
rm package.json yarn.lock
```
   
2) Rename file `package-empty.json` to `package.json` using command:
```
mv package-empty.json package.json
```

3) Install the newest versions of packages using command:
```
yarn add --dev ethers hardhat hardhat-deploy @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle ethereum-waffle chai dotenv hardhat-contract-sizer hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage @chainlink/contracts @openzeppelin/contracts
```

## 5. Complete enviornmental variables in .env file

Rename file `.env.example` to `.env` and use it as a template:
```
mv .env.example .env
```

## 6. Test if your project setup works properly
```
yarn hardhat or hh
```