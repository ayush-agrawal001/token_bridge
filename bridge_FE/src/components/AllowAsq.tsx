import { useWriteContract } from "wagmi"
import { usdtAbi } from "../../utils/AsqABI";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

export function AllowUsdt({isConnected} : {isConnected : boolean}) {
    
    const [isSwapping, setIsSwapping] = useState(false)
    const {writeContract, data : hash} = useWriteContract(); 

    async function allowAsqToSwap(){
        writeContract({
            address : "0xdac17f958d2ee523a2206206994597c13d831ec7",
            abi : usdtAbi,
            functionName : "approve",
            args : ["0xC1D3C44920B633Abc3C52430a3D1884f6353742F", BigInt(100000)]
        })
    }

    
    const handleSwap = async () => {
        if (!isConnected) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your wallet to swap ASQ",
            })
            return;
        }
        setIsSwapping(true)
        try {
        await allowAsqToSwap() 
        setTimeout(() => {
            setIsSwapping(false);
        }, 5000)
        } catch (error : any) {
            setIsSwapping(false);
            toast({
                title: "Swap Failed",
                description: "An error occurred during swapping",
                variant: "destructive",
            });
        }
    }

    useEffect(() => {
        if(hash){
            toast({
                title: "Swap Success",
                description: "Swap ASQ successfully",
                variant: "default",
            });
        }
    }, [hash])

    return(
        <div>
            <Button
            className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-neon-purple hover:to-neon-blue font-pixel transition-all duration-300"
            onClick={handleSwap}
            disabled={isSwapping}
        >
            {isSwapping ? <span className="animate-pulse">Swapping...</span> : "Swap"}
        </Button>
        </div>
    )
}