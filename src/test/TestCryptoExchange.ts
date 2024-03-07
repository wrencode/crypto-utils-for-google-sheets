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
  // let cryptocurrency = "XNO"
  // let cryptocurrency = "NEO"
  // let cryptocurrency = "GAS"
  // let cryptocurrency = "EXIT"
  // let cryptocurrency = "TZROP"
  // let cryptocurrency = "ALGO"

  // let exchanges = ""
  let exchanges = "binance-us"
  // let exchanges = "binance-us,kraken,coinbase,gemini,kucoin"

  // let deprecatedExchanges = "bittrex"

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

function testBinanceUSExchangeBalance() {
  let cryptocurrency = "ETH"
  // let cryptocurrency = "IOTA"
  // let cryptocurrency = "BNB"
  // let cryptocurrency = "KCS"
  // let cryptocurrency = "XNO"
  // let cryptocurrency = "NEO"
  // let cryptocurrency = "GAS"
  // let cryptocurrency = "EXIT"
  // let cryptocurrency = "TZROP"
  // let cryptocurrency = "ALGO"

  let exchanges = "binance-us"
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
}

function testKrakenExchangeBalance() {
  let cryptocurrency = "ETH"
  // let cryptocurrency = "IOTA"
  // let cryptocurrency = "BNB"
  // let cryptocurrency = "KCS"
  // let cryptocurrency = "XNO"
  // let cryptocurrency = "NEO"
  // let cryptocurrency = "GAS"
  // let cryptocurrency = "EXIT"
  // let cryptocurrency = "TZROP"
  // let cryptocurrency = "ALGO"

  let exchanges = "kraken"
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
}

function testBittrexExchangeBalance() {
  let cryptocurrency = "ETH"
  // let cryptocurrency = "IOTA"
  // let cryptocurrency = "BNB"
  // let cryptocurrency = "KCS"
  // let cryptocurrency = "XNO"
  // let cryptocurrency = "NEO"
  // let cryptocurrency = "GAS"
  // let cryptocurrency = "EXIT"
  // let cryptocurrency = "TZROP"
  // let cryptocurrency = "ALGO"

  let exchanges = "bittrex"
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
}

function testCoinbaseExchangeBalance() {
  let cryptocurrency = "ETH"
  // let cryptocurrency = "IOTA"
  // let cryptocurrency = "BNB"
  // let cryptocurrency = "KCS"
  // let cryptocurrency = "XNO"
  // let cryptocurrency = "NEO"
  // let cryptocurrency = "GAS"
  // let cryptocurrency = "EXIT"
  // let cryptocurrency = "TZROP"
  // let cryptocurrency = "ALGO"

  let exchanges = "coinbase"
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
}

function testCoinbaseAdvancedTradingExchange() {
  let cryptocurrency = "ETH"
  // let cryptocurrency = "IOTA"
  // let cryptocurrency = "BNB"
  // let cryptocurrency = "KCS"
  // let cryptocurrency = "XNO"
  // let cryptocurrency = "NEO"
  // let cryptocurrency = "GAS"
  // let cryptocurrency = "EXIT"
  // let cryptocurrency = "TZROP"
  // let cryptocurrency = "ALGO"

  let exchanges = "coinbase-adv"
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
}

function testGeminiExchange() {
  let cryptocurrency = "ETH"
  // let cryptocurrency = "IOTA"
  // let cryptocurrency = "BNB"
  // let cryptocurrency = "KCS"
  // let cryptocurrency = "XNO"
  // let cryptocurrency = "NEO"
  // let cryptocurrency = "GAS"
  // let cryptocurrency = "EXIT"
  // let cryptocurrency = "TZROP"
  // let cryptocurrency = "ALGO"

  let exchanges = "gemini"
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
}

export {testCryptoExchangeBalance}
