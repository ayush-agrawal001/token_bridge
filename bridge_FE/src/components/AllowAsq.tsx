import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { polygonAmoy, sepolia } from "viem/chains";
import { Address } from "viem";
import { BRIDGE_ABI, TOKEN_ADDRESSES, BRIDGE_ADDRESSES, ALLOWANCE_ABI, APPROVE_ABI, BRIDGE_WASQ_ABI } from "../../utils/abiForAllow";
import { allowAsqToSwap, callBridge } from "@/lib/ethSide";

export function AllowUsdt({fromCurrency, toCurrency, fromAmount, toAmount} : {fromCurrency : string, toCurrency : string, fromAmount : number, toAmount : number}) {
    
    const [isSwapping, setIsSwapping] = useState(false)
    const [chainIdState, setChainId] = useState(0);
    const [tokenAddress, setTokenAddress] = useState<Address>();
    const [bridgeAddress, setBridgeAddress] = useState<Address>();
    const [allowanceAmount, setAllowanceAmount] = useState(BigInt(0));
    
    const withdrawAmount = fromAmount * 10 ** 18;

    const { address, chainId } = useAccount();

    const {data : hash0, writeContract : writeContract0} = useWriteContract();
    const {data : hash1, writeContract : writeContract1} = useWriteContract();
    
    const {data : _hash000, isSuccess : isSuccess0, isError : isError0} = useWaitForTransactionReceipt({
        hash: hash0,
    });

    const {data : _hash001, isSuccess : isSuccess1, isError : isError1} = useWaitForTransactionReceipt({
        hash: hash1,
    });
    
    const allowance = useReadContract({
        address: tokenAddress,
        abi: ALLOWANCE_ABI,
        functionName: 'allowance',
        args: [address!, bridgeAddress!],
        chainId: chainIdState,
    });

    const pendingBalance = useReadContract({
        address: BRIDGE_ADDRESSES.WASQ,
        abi: BRIDGE_WASQ_ABI,
        functionName: 'pendingBalance',
        args: [address!],
        chainId: chainIdState,
    });
    


    const ammountToswap = fromAmount * 10 ** 18;
    
    const handleSwap = async () => {
        try {
            if (address) {
            if (chainId !== chainIdState) {
                toast({
                    title: `Switch to ${fromCurrency !== "ASQ" ? "Polygon Amoy" : "Sepolia"} chain`,
                    description: "Please switch to correct network",
                    variant: "destructive",
                });
                return;
            }
            if (fromAmount === 0 || toAmount === 0 || !fromAmount || !toAmount) { 
                toast({
                    title: "Enter amount",
                    description: "Please enter valid amount",
                    variant: "destructive",
                });
                return;
            }
            
            if(tokenAddress === TOKEN_ADDRESSES.WASQ) {
                toast({
                    title: "Confirm the transaction",
                    description: "Allow transaction within 25 seconds or it will fail",
                    variant: "default",
                });
                setIsSwapping(true);
                return;
            }

            toast({
                title: "Please Allow ASQ",
                description: "Allow ASQ within 25 seconds or it will fail",
                variant: "default",
            });

            setIsSwapping(true);
            await allowAsqToSwap({tokenAddress, bridgeAddress, chainIdState, setIsSwapping, writeContract : writeContract0, ammountToswap});
            await allowance.refetch();
            
            setTimeout(() => {
                try {
                    if (allowanceAmount === BigInt(0)) {
                        setIsSwapping(false);
                        if (isSwapping) {
                            throw new Error("User inactive or closed the wallet");

                        }
                    }
                } catch (error) {
                    console.error(error);
                    setIsSwapping(false);
                    toast({
                        title: "Swap Failed",
                        description: "Wallet was closed or user inactive",
                        variant: "destructive",
                    });
                }
            }, 45000);
            }else{
                toast({
                    title: "Connect your wallet",
                    description: "Please connect your wallet",
                    variant: "destructive",
                });
            }
        }catch(e : any){
            setIsSwapping(false);
            console.log(e);
            toast({
                title: "Swap Failed",
                description: "Error while Allowing ASQ",
                variant: "default",
            });
        }
    }
    
    async function refetching(){
        console.log(allowance.data);
        console.log(isSwapping);
        if (allowance.data && isSwapping) {
            toast({
                title: "got allowance", 
                description: "Allowance is " + parseInt(allowance.data.toString()) / 10 ** 18,
                variant: "default",
            });
            setAllowanceAmount(allowance.data!);
            await callBridge({tokenAddress, bridgeAddress, chainIdState, writeContract : writeContract1, ammountToswap, allowanceAmount});
        }
    }


    const withdrawFromBridge = async () => {
        writeContract1({
            address: BRIDGE_ADDRESSES.WASQ,
            abi: BRIDGE_WASQ_ABI,
            functionName: "withdraw",
            args: [TOKEN_ADDRESSES.WASQ, BigInt(withdrawAmount)],
            chainId: chainIdState,
        });
    }

    async function refetchingWasq(){
        await pendingBalance.refetch();
        console.log(pendingBalance.data);
        console.log(withdrawAmount);
        if (pendingBalance.data < BigInt(withdrawAmount) && isSwapping) {
            toast({
                title: "Not enough balance",
                description: "You don't have enough balance to swap",
                variant: "destructive",
            });
            setIsSwapping(false);
            return;
        }else if(isSwapping){
            try {
                await withdrawFromBridge();
            } catch (error) {
                console.error(error);
                setIsSwapping(false);
                toast({
                    title: "Swap Failed",
                    description: "Wallet was closed or user inactive",
                    variant: "destructive",
                });
            }
        }

    }

    useEffect(() => {
        try {
            if (tokenAddress === TOKEN_ADDRESSES.ASQ || fromCurrency === "ASQ") {
                refetching();
            }else if (tokenAddress === TOKEN_ADDRESSES.WASQ && fromCurrency === "WASQ") {
                console.log("WASQ");
                refetchingWasq();
            }
        }catch(e : any){
            console.log(e);
            toast({
                title: "Swap Failed",
                description: "Error while Swapping",
                variant: "destructive",
            });
        }
    },[allowance.data, isSwapping, allowanceAmount, isSuccess0, isError0]);

    useEffect(() => {
        if (fromCurrency === "ASQ" && toCurrency === "WASQ") {
            setChainId(sepolia.id);
            setTokenAddress("0x0C6bC067846a6dC571D4EFB4A198FC898D8903B7");
            setBridgeAddress("0xFcB2C08C368B65b4cB1538d9007C0C9Fe495E624");
        }else if (fromCurrency === "WASQ" && toCurrency === "ASQ") {
            setChainId(polygonAmoy.id);
            setTokenAddress("0x0c6bc067846a6dc571d4efb4a198fc898d8903b7");
            setBridgeAddress("0x1Ef9Ba4Fc62EeCFC39Cf7fE913d271a556D1738b");
        }
    }, [fromCurrency, toCurrency]);
    // const originalWarn = console.warn();

    
    useEffect(() => {
        if (isSuccess1) {
            toast({title : "Swap Successful", description : "You can check your balance on the bridge page", variant : "default"});
            setIsSwapping(false);
        }if (isError1) {
            toast({title : "Swap Failed", description : "Error while Swapping", variant : "destructive"});
            setIsSwapping(false);
        }
    }, [isSuccess1, isError1]);

    useEffect(() => {
        if (isSuccess0) {
            toast({title : "approve Successful", description : "You can check your balance on the bridge page", variant : "default"});
            setIsSwapping(false);
        }if (isError0) {
            toast({title : "approve Failed", description : "Error while Swapping", variant : "destructive"});
            setIsSwapping(false);
        }

        console.log("isSuccess0" , isSuccess0);
    }, [isSuccess0, isError0]);

    return(
        <div>
            <Button
            className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-neon-purple hover:to-neon-blue font-pixel transition-all duration-300"
            onClick={handleSwap}
            disabled={isSwapping}
        >
            {isSwapping ? <span className="animate-pulse">Swapping...</span> : (fromCurrency === "ASQ" ? "Swap ASQ" : "Get WASQ")}
        </Button>
        </div>
    )
}