// import { CRYPTO_PRICE, CRYPTO_PRICE_ON_DATE, CRYPTO_NAME, CRYPTO_TYPE } from "../crypto/CryptoInfo"

// noinspection JSUnusedGlobalSymbols
/**
 * Test CRYPTO_PRICE function.
 */
function testCryptoPrice() {
  let currencyIn = "ETH"
  // let currencyIn = "NANO"
  // let currencyIn = "BAN"
  // let currencyIn = "MCT"
  // let currencyIn = "TKY"
  // let currencyIn = "DBC"
  // let currencyIn = "MATIC"
  // let currencyIn = "EXIT"
  // let currencyIn = "YLDY"
  // let currencyIn = "TZROP"
  // let currencyIn = "YLDY"
  // let currencyIn = "DEFLY"

  let currencyOut = "USD"
  // let currencyOut = "ETH"

  let apiKey = "";
  try {
    apiKey = PropertiesService.getScriptProperties().getProperty("CRYPTOCOMPARE_API_KEY") || ""
  } catch (e) {
    if (e instanceof ReferenceError) {
      apiKey = process.env.CRYPTOCOMPARE_API_KEY || ""
    }
  }

  // let timestamp = 1514851200
  // let timestamp = 1544745600

  // cryptoInfo.CRYPTO_PRICE(currencyIn, currencyOut, apiKey, true, timestamp)
  //@ts-ignore
  CRYPTO_PRICE(currencyIn, currencyOut, apiKey)
}

// noinspection JSUnusedGlobalSymbols
/**
 * Test CRYPTO_PRICE_ON_DATE function.
 */
function testCryptoPriceOnDate() {
  let currencyIn = "ETH"
  let currencyOut = "USD"
  let timestamp = 1514764800

  let apiKey = "";
  try {
    apiKey = PropertiesService.getScriptProperties().getProperty("CRYPTOCOMPARE_API_KEY") || ""
  } catch (e) {
    if (e instanceof ReferenceError) {
      apiKey = process.env.CRYPTOCOMPARE_API_KEY || ""
    }
  }

  //@ts-ignore
  CRYPTO_PRICE_ON_DATE(currencyIn, currencyOut, apiKey, timestamp)
}

// noinspection JSUnusedGlobalSymbols
/**
 * Test CRYPTO_NAME function.
 */
function testCryptoName() {
  let ticker = "ETH"
  // let ticker = "MATIC"
  // let ticker = "IOTA"
  // let ticker = "MCT"
  // let ticker = "EXIT"
  // let ticker = "YLDY"
  // let ticker = "DEFLY"

  let apiKey = "";
  try {
    apiKey = PropertiesService.getScriptProperties().getProperty("LIVECOINWATCH_API_KEY") || ""
  } catch (e) {
    if (e instanceof ReferenceError) {
      apiKey = process.env.LIVECOINWATCH_API_KEY || ""
    }
  }

  console.log("Getting name for " + ticker)
  //@ts-ignore
  CRYPTO_NAME(ticker, apiKey)
}

// noinspection JSUnusedGlobalSymbols
/**
 * Test CRYPTO_TYPE function.
 */
function testCryptoType() {
  let ticker = "ETH"
  // let ticker = "IOTA"
  // let ticker = "MATIC"
  // let ticker = "EXIT"
  // let ticker = "USDC"
  // let ticker = "ALGO"
  // let ticker = "XMR"
  // let ticker = "NANO"
  // let ticker = "BNB"
  // let ticker = "XMR"
  // let ticker = "KCS"
  // let ticker = "USDT"
  // let ticker = "ARK"
  // let ticker = "BAN"
  // let ticker = "BTC"
  // let ticker = "DBC"
  // let ticker = "GAS"
  // let ticker = "MCT"
  // let ticker = "NEO"
  // let ticker = "OMG"
  // let ticker = "ONT"
  // let ticker = "POE"
  // let ticker = "POLY"
  // let ticker = "TKY"
  // let ticker = "YLDY"
  // let ticker = "DEFLY"

  //@ts-ignore
  CRYPTO_TYPE(ticker)
}

// testCryptoPrice()
// testCryptoPriceOnDate()
// testCryptoName()
// testCryptoType()
