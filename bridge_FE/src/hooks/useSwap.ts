import { useState, useCallback } from "react"
import { formatAmount, calculateExchangeRate } from "../../utils/swapUtils"

export const useSwap = () => {
  const [fromCurrency, setFromCurrency] = useState("ASQ")
  const [toCurrency, setToCurrency] = useState("WASQ")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")

  const handleFromAmountChange = useCallback(
    (value: string) => {
      setFromAmount(value)
      const exchangeRate = calculateExchangeRate(fromCurrency, toCurrency)
      setToAmount(formatAmount((Number.parseFloat(value) * exchangeRate).toString()))
    },
    [fromCurrency, toCurrency],
  )

  const handleToAmountChange = useCallback(
    (value: string) => {
      setToAmount(value)
      const exchangeRate = calculateExchangeRate(fromCurrency, toCurrency)
      setFromAmount(formatAmount((Number.parseFloat(value) / exchangeRate).toString()))
    },
    [fromCurrency, toCurrency],
  )

  const handleSwapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }, [fromCurrency, toCurrency, fromAmount, toAmount])

  return {
    fromCurrency,
    toCurrency,
    fromAmount,
    toAmount,
    setFromCurrency,
    setToCurrency,
    handleFromAmountChange,
    handleToAmountChange,
    handleSwapCurrencies,
  }
}

