import { toast } from "@/hooks/use-toast";
import { APPROVE_ABI, BRIDGE_ABI } from "../../utils/abiForAllow";

async function allowAsqToSwap({tokenAddress, bridgeAddress, chainIdState, setIsSwapping, writeContract, ammountToswap}) {
    if (tokenAddress && bridgeAddress) {
        try {
            writeContract({
                address : tokenAddress,
                abi : APPROVE_ABI,
                functionName : "approve",
                args : [bridgeAddress, BigInt(ammountToswap)],
                chainId : chainIdState,
            })
        } catch (error : any) {
            if (error.message === "User inactive or closed the wallet") {
                console.log("User likely closed the wallet or ignored the transaction.");
                
            } else {
                console.error("Transaction error:", error);
            }
            setIsSwapping(false);
            return;
        }
    }else {
        console.log("Token Address is not correct");
        setIsSwapping(false);
        toast({
            title: "Swap Failed",
            description: "Token Address is not correct",
            variant: "destructive",
        });
        return;
    }
}

async function callBridge({tokenAddress, bridgeAddress, chainIdState, writeContract, ammountToswap, allowanceAmount}) {
    console.log("token Address" + tokenAddress)
    console.log("bridgeAddress", bridgeAddress)
    console.log("allowanceAmount", allowanceAmount)
    console.log("ammountToswap", ammountToswap)
    if (tokenAddress && bridgeAddress) {
        if (allowanceAmount >= ammountToswap) {
            writeContract({
                address: bridgeAddress,
                abi: BRIDGE_ABI,
                functionName: "deposit",
                args: [tokenAddress, BigInt(String(ammountToswap))],
                chainId: chainIdState,
            });
        }
    }
}

export { allowAsqToSwap, callBridge };