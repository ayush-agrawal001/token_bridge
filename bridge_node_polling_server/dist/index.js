"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
require("dotenv/config");
const sepoliaProvider = new ethers_1.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/jcDIXrzcNmSNVF3OyNWUBKCa1Cn95uA2");
const polProvider = new ethers_1.JsonRpcProvider("https://polygon-amoy.g.alchemy.com/v2/jcDIXrzcNmSNVF3OyNWUBKCa1Cn95uA2");
let address = [];
const abiBridgePol = [{ "inputs": [{
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
    }];
const callBridgePol = (addressOfSwapper) => __awaiter(void 0, void 0, void 0, function* () {
    const amount = 1 * 10 ** 18;
    const signer = new ethers_1.Wallet(String(process.env.PRIVATE_KEY), polProvider);
    const polContract = new ethers_1.Contract("0x1Ef9Ba4Fc62EeCFC39Cf7fE913d271a556D1738b", abiBridgePol, signer);
    return polContract.depositedOnOtherSide(addressOfSwapper, BigInt(amount));
});
function callingBridgeOnce() {
    return __awaiter(this, void 0, void 0, function* () {
        if (address[0]) {
            const addressOfSwapper = address[0];
            yield callBridgePol(addressOfSwapper);
        }
        i++;
    });
}
function polling(blockNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const cuurentBlock = yield sepoliaProvider.getBlockNumber();
        const sepoliaBlock = yield sepoliaProvider.getLogs({
            address: "0xFcB2C08C368B65b4cB1538d9007C0C9Fe495E624",
            fromBlock: blockNumber,
            toBlock: blockNumber,
            topics: [(0, ethers_1.id)("Deposit(address,uint256)")]
        });
        for (let i = 0; i < sepoliaBlock.length; i++) {
            address.push("0x" + sepoliaBlock[i].topics[1].slice(26));
        }
    });
}
let i = 7666971;
() => __awaiter(void 0, void 0, void 0, function* () {
    i = (yield sepoliaProvider.getBlockNumber()) - 2;
});
setInterval(() => {
    polling(i);
    callingBridgeOnce();
    i++;
}, 10000);
