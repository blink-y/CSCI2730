const Provider = require('@truffle/hdwallet-provider');
const Web3 = require('web3').default;

const soulBound = require('./Soulbound.json');
const { response } = require('express');

var contractAddress = '0x8240414d15fBB90b99d949f4957ed8607aCF7c2C';
var infuraUrl = 'https://sepolia.infura.io/v3/e70ad9ac0d3b406ca0d41a92de49180a';
const ownerPrivateKey = 'ecfebf69bb36d670dd788e20865e8b22a3135cefd7b693d0cbef4e4a3cde171e';
const Owner = '0xecD22329b2F296DcF6E63f59c0658A67B3aCFa95';
const metadata = 'https://moccasin-manual-donkey-248.mypinata.cloud/ipfs/bafkreigogopk72zmbmneaelviqjv4mnduq32fqunz26wl2vdtqmnar5gk4';

function initializeContract(privateKey, infuraUrl, contractAddress) {
    const provider = new Provider(privateKey, infuraUrl);
    const web3 = new Web3(provider);
    const SoulBound = new web3.eth.Contract(soulBound.abi, contractAddress);

    return { SoulBound, web3 };
}

async function mintToken(address) {
    const { web3, SoulBound } = initializeContract(ownerPrivateKey, infuraUrl, contractAddress);

    try {
        const mint = await SoulBound.methods.safeMint(address, metadata).send({ from: Owner });
        console.log(`Minted to address ${address}, Metadata ${metadata}. Transaction hash: ${mint.transactionHash}`);
    } catch (error) {
        console.error('Error minting token:', error);
    } finally {
        if (web3.currentProvider && web3.currentProvider.connection) {
            web3.currentProvider.connection.close();
        }

    }
}

async function checkToken(address) {
    const { web3, SoulBound } = initializeContract(ownerPrivateKey, infuraUrl, contractAddress);

    let hasToken = false;
    try {
        hasToken = await SoulBound.methods.hasToken(address).call();
        console.log(`TokenId: ${hasToken}`);
    } catch (error) {
        console.error('Error checking token:', error);
    } finally {
        if (web3.currentProvider && web3.currentProvider.connection) {
            web3.currentProvider.connection.close();
        }
    }
    return { hasToken };
}

async function getInfo() {
    let tokenName, tokenDescription, tokenImage, tokenSymbol;
    console.log('Getting token info');
    const { web3, SoulBound } = initializeContract(ownerPrivateKey, infuraUrl, contractAddress);
    try {
        console.log('Getting');
        tokenSymbol = await SoulBound.methods.symbol().call();
        try {
            const tokenURI = await SoulBound.methods.tokenURI(1).call();
            console.log('Token URI:', tokenURI);

            const response = await fetch(tokenURI);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const tokenMetadata = await response.json();
            tokenName = tokenMetadata.name;
            tokenDescription = tokenMetadata.description;
            tokenImage = tokenMetadata.image;
            console.log('Token Metadata:', tokenMetadata);
        } catch (error) {
            console.error('Error fetching token metadata:', error);
        }
    } catch (error) {
        console.log('Error getting token info');
        console.error('Error getting token:', error);
    } finally {
        if (web3.currentProvider && web3.currentProvider.connection) {
            web3.currentProvider.connection.close();
        }
    }

    return { tokenName, tokenSymbol, tokenDescription, tokenImage };
}

module.exports = {
    mintToken,
    checkToken,
    getInfo
};

// const run = async () => {
//     const address = '0x9A54aEeC49B0C30Cdc17a8Fff1221480a0aced6f';
//     //await checkToken(address);
//     //await mintToken(address);
//     await getInfo();
// }
// run();

