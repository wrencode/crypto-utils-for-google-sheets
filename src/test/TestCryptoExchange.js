// import CRYPTO_EXCHANGE_BALANCE from "../crypto/CryptoExchange.js"

/**
 * Test CRYPTO_EXCHANGE_BALANCE function.
 */
function testCryptoExchangeBalance() {
  let cryptocurrency = "ETH"
  // let cryptocurrency = "IOTA"
  // let cryptocurrency = "BNB"
  // let cryptocurrency = "KCS"
  // let cryptocurrency = "NANO"
  // let cryptocurrency = "NEO"
  // let cryptocurrency = "GAS"
  // let cryptocurrency = "EXIT"
  // let cryptocurrency = "TZROP"
  // let cryptocurrency = "ALGO"
  let exchanges = "binance-us"
  // let exchanges = "binance-us,kucoin,kraken,bittrex,coinbase,coinbase-pro,gemini,coinex,tzero,mexc"
  // let exchanges = ""

  CRYPTO_EXCHANGE_BALANCE(cryptocurrency, exchanges)
}

// testCryptoExchangeBalance()
