const Provider = require('@truffle/hdwallet-provider');
const Web3 = require('web3').default;

const soulBound = require('./Soulbound.json');

var contractAddress = '0x2932d1E5b303251aB528FF8Ab8Ff35f502b9dDF1';
var infuraUrl = 'https://sepolia.infura.io/v3/089a4f3891ca4778a39e0cc22937aed6';

const ownerPrivateKey = 'ecfebf69bb36d670dd788e20865e8b22a3135cefd7b693d0cbef4e4a3cde171e';

function initializeContract(privateKey, infuraUrl, contractAddress) {
    const provider = new Provider(privateKey, infuraUrl);
    const web3 = new Web3(provider);
    const SoulBound = new web3.eth.Contract(soulBound.abi, contractAddress);

    return { SoulBound, web3 };
}

async function mintToken(address) {
    const metadata = 'https://moccasin-manual-donkey-248.mypinata.cloud/ipfs/bafkreigogopk72zmbmneaelviqjv4mnduq32fqunz26wl2vdtqmnar5gk4';
    const Owner = '0xecD22329b2F296DcF6E63f59c0658A67B3aCFa95';
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

module.exports = mintToken;