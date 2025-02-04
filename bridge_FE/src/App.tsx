import RetroSwap from "./RetroSwap"
import { WagmiProvider } from "wagmi"
import wagmiConfig from "../utils/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
  return <div>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RetroSwap />
      </QueryClientProvider>
    </WagmiProvider>
  </div>
}
