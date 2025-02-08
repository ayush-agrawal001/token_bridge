import { Contract, getAddress, getIcapAddress, id, isAddress, JsonRpcProvider, resolveAddress, Wallet } from "ethers";
import "dotenv/config";
const sepoliaProvider = new JsonRpcProvider(String(process.env.SEPOLIA_RPC_URL)); 
const polProvider = new JsonRpcProvider(String(process.env.PRIVATE_KEY)); 

let address : string[] = [];

const abiBridgePol = [{"inputs": [{
                "internalType": "address",
                "name": "userAccount",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }],
        "name": "depositedOnOtherSide",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
}]


const callBridgePol = async (addressOfSwapper: string) => {
    const amount = 1 * 10 ** 18;
    const signer = new Wallet(String(process.env.PRIVATE_KEY), polProvider);
    const polContract = new Contract("0x1Ef9Ba4Fc62EeCFC39Cf7fE913d271a556D1738b", abiBridgePol, signer);
    return polContract.depositedOnOtherSide(addressOfSwapper, BigInt(amount));
}

async function callingBridgeOnce() {
    if (address[0]) {
        const addressOfSwapper = address[0];
        await callBridgePol(addressOfSwapper);
    }
    i++;
}

async function polling(blockNumber: number) {
    const cuurentBlock = await sepoliaProvider.getBlockNumber();

    const sepoliaBlock = await sepoliaProvider.getLogs({
        address : "0xFcB2C08C368B65b4cB1538d9007C0C9Fe495E624",
        fromBlock: blockNumber,
        toBlock: blockNumber,
        topics: [id("Deposit(address,uint256)")]
    });
    for (let i = 0; i < sepoliaBlock.length; i++) {
        address.push("0x" + sepoliaBlock[i].topics[1].slice(26));
    }
}

let i = 7666971;

async () => {
    i = await sepoliaProvider.getBlockNumber() - 2;
}


setInterval(() => {
    polling(i);
    callingBridgeOnce();
    i++;
}, 10000);
