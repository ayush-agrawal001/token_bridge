import { http, createConfig, injected } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"

const wagmiConfig = createConfig({
    connectors : [injected()],
    chains : [mainnet, sepolia],
    transports : { 
        [mainnet.id] : http(),
        [sepolia.id] : http()
    }
}) 

export default wagmiConfig;