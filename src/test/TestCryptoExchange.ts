// import { CRYPTO_EXCHANGE_BALANCE } from "../crypto/CryptoExchange"

// noinspection JSUnusedGlobalSymbols
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

  // let exchanges = ""
  let exchanges = "binance-us"
  // let exchanges = "binance-us,kraken,bittrex,coinbase,coinbase-pro,gemini"

  // let deprecatedExchanges = "kucoin"

  // need to figure out how to deal with 2fa on tzero
  // let devExchanges = "tzero,coinex,mexc"

  let exchangesApiCredentials = "";
  try {
    exchangesApiCredentials = PropertiesService.getScriptProperties().getProperty("EXCHANGES_API_CREDENTIALS") || ""
  } catch (e) {
    if (e instanceof ReferenceError) {
      exchangesApiCredentials = process.env.EXCHANGES_API_CREDENTIALS || ""
    }
  }

  // @ts-ignore
  CRYPTO_EXCHANGE_BALANCE(cryptocurrency, exchanges, exchangesApiCredentials)
  // CRYPTO_EXCHANGE_BALANCE(cryptocurrency, devExchanges, exchangesApiCredentials)
}

// testCryptoExchangeBalance()

export {testCryptoExchangeBalance}
