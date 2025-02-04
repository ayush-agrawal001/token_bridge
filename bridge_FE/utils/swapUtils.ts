export const formatAmount = (amount: string): string => {
  const parsedAmount = Number.parseFloat(amount)
  if (isNaN(parsedAmount)) return "0.00"
  return parsedAmount.toFixed(2)
}

export const calculateExchangeRate = (from: string, to: string): number => {
  // This is a mock function. In a real app, you'd fetch real exchange rates.
  const rates: { [key: string]: number } = {
    ASQ : 1,
    WASQ : 1,
  }
  return rates[to] / rates[from]
}

