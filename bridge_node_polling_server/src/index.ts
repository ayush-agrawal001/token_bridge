import { id, JsonRpcProvider } from "ethers";
import "dotenv/config"

const provider = new JsonRpcProvider(String(process.env.RPC_URL));

async function polling(blockNumber : number){
    const logs = await provider.getLogs({
        address : "0xdac17f958d2ee523a2206206994597c13d831ec7",
        fromBlock : blockNumber,
        toBlock : blockNumber + 2,
        topics : [id("Transfer(address,address,uint256)")]
    })

    console.log(logs);
}

polling(21493826)