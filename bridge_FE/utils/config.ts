import { http, createConfig, injected } from "wagmi"
import { polygonAmoy, sepolia } from "wagmi/chains"

const wagmiConfig = createConfig({
    connectors : [injected()],
    chains : [sepolia, polygonAmoy],
    transports : { 
        // [mainnet.id] : http(),
        [polygonAmoy.id] : http(String(process.env.VITE_POLYGON_RPC_URL)),
        [sepolia.id] : http(String(process.env.VITE_SEPOLIA_RPC_URL)),
    }
}) 

export default wagmiConfig;