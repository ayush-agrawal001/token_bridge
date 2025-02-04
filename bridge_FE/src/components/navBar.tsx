"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import GlitchText from "./GlitchText"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { toast } from "@/hooks/use-toast"

export default function Navbar() {
    // const [isConnected, setIsConnected] = useState(false)
    const { connect, connectors } = useConnect()
    
    const {address} = useAccount();
    const { disconnect } = useDisconnect();

    useEffect(() => {
        if (address) {
            toast({
                title: "Connected with ->",
                description: address,
            })
        }
    }, [address])

    return (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
        <nav className="w-8/12 flex items-center justify-between px-6 py-4 border border-neon-blue bg-black bg-opacity-70 shadow-neon rounded-full">
            <GlitchText className="ml-10 text-sm font-bold text-neon-pink font-pixel">BridgeChain</GlitchText>
            <div className="mr-10">
                        {address ? <Button onClick={() => disconnect()} className="text-sm font-semibold transition-all duration-300 ease-in-out rounded-full font-pixel bg-neon-green text-black hover:bg-neon-blue hover:text-white">
                            Disconnect
                        </Button> : <Select>
                        <SelectTrigger className="bg-black text-neon-green border-neon-green">
                        <Button className="text-sm font-semibold transition-all duration-300 ease-in-out rounded-full font-pixel bg-neon-purple text-white hover:bg-neon-pink hover:text-black">
                            Connect Wallet
                        </Button>
                    </SelectTrigger>
                    <SelectContent className="">
                    {connectors.map((connector) => (
                        <div>
                            <Button onClick={() => {
                                connect({connector})
                                }} className="bg-black text-neon-green border-neon-green p-5 w-52">
                                {connector.name}
                            </Button>
                        </div>
                    ))}
                    </SelectContent>
                </Select>}
            </div>
        </nav>
        </div>
  )
}

