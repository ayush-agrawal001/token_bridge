"use client"

import { useState } from "react"
import { useSwap } from "./hooks/useSwap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownUp } from "lucide-react"
import ParticleBackground from "./components/ParticleBackground"
import Navbar from "./components/navBar"
import GlitchText from "./components/GlitchText"
import { Toaster } from "./components/ui/toaster"
import { AllowUsdt } from "./components/AllowAsq"
import { useAccount } from "wagmi"

const currencies = ["ASQ", "WASQ"]

export default function RetroSwap() {
  const {
    fromCurrency,
    toCurrency,
    fromAmount,
    toAmount,
    setFromCurrency,
    setToCurrency,
    handleFromAmountChange,
    handleToAmountChange,
    handleSwapCurrencies,
  } = useSwap()

  const {isConnected} = useAccount();

  return (
    <div className="min-h-screen bg-black text-neon-blue relative overflow-hidden">
      <ParticleBackground />
      <div className="min-h-screen flex items-center justify-center relative z-10 p-4">
        <Navbar />
        <div className="w-full max-w-md bg-black bg-opacity-70 rounded-xl overflow-hidden border border-neon-pink shadow-neon">
          <div className="bg-gradient-to-r from-neon-purple to-neon-blue p-6 text-center">
            <GlitchText className="text-sm border border-white p-10 font-bold text-white font-pixel">!!! BRIDGE ASQ NOW !!!</GlitchText>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-[120px] bg-black text-neon-green border-neon-green">
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent className="bg-black text-neon-green border-neon-green">
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  className="flex-1 bg-black text-neon-green border-neon-green placeholder-neon-green placeholder-opacity-50"
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-black text-neon-pink border-neon-pink hover:text-black transition-all duration-300"
                  onClick={handleSwapCurrencies}
                >
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-[120px] bg-black text-neon-green border-neon-green">
                    <SelectValue placeholder="To" />
                  </SelectTrigger>
                  <SelectContent className="bg-black text-neon-green border-neon-green">
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={toAmount}
                  onChange={(e) => handleToAmountChange(e.target.value)}
                  className="flex-1 bg-black text-neon-green border-neon-green placeholder-neon-green placeholder-opacity-50"
                  placeholder="0.00"
                />
              </div>
            </div>
            <AllowUsdt isConnected={isConnected}/>
            <GlitchText className="text-center text-sm text-neon-orange font-pixel">
              Enter amount and click "Swap"
            </GlitchText>
          </div>
        </div>
      </div>
      <Toaster></Toaster>
    </div>
  )
}

