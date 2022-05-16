// import { CRYPTO_PRICE, CRYPTO_PRICE_ON_DATE, CRYPTO_NAME, CRYPTO_TYPE } from "../crypto/CryptoInfo.js"

/**
 * Test CRYPTO_PRICE function.
 */
function testCryptoPrice() {
  let currencyIn = "ETH"
  // let currencyIn = "NANO"
  // let currencyIn = "BAN"
  // var currencyIn = "MCT"
  // var currencyIn = "TKY"
  // var currencyIn = "DBC"
  // var currencyIn = "MATIC"
  // var currencyIn = "EXIT"
  // var currencyIn = "YLDY"
  // var currencyIn = "TZROP"
  // var currencyIn = "YLDY"
  // var currencyIn = "DEFLY"

  let currencyOut = "USD"
  // let currencyOut = "ETH"

  let apiKey;
  try {
    apiKey = PropertiesService.getScriptProperties().getProperty("CRYPTOCOMPARE_API_KEY")
  } catch (e) {
    if (e instanceof ReferenceError) {
      apiKey = process.env.CRYPTOCOMPARE_API_KEY
    }
  }

  // let timestamp = 1514851200
  // let timestamp = 1544745600

  // CRYPTO_PRICE(currencyIn, currencyOut, apiKey, true, timestamp)
  CRYPTO_PRICE(currencyIn, currencyOut, apiKey, true)
}

/**
 * Test CRYPTO_PRICE_ON_DATE function.
 */
function testCryptoPriceOnDate() {
  let currencyIn = "ETH"
  let currencyOut = "USD"
  let timestamp = 1514764800

  let apiKey;
  try {
    apiKey = PropertiesService.getScriptProperties().getProperty("CRYPTOCOMPARE_API_KEY")
  } catch (e) {
    if (e instanceof ReferenceError) {
      apiKey = process.env.CRYPTOCOMPARE_API_KEY
    }
  }

  CRYPTO_PRICE_ON_DATE(currencyIn, currencyOut, timestamp, apiKey)
}

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

  let apiKey;
  try {
    apiKey = PropertiesService.getScriptProperties().getProperty("LIVECOINWATCH_API_KEY")
  } catch (e) {
    if (e instanceof ReferenceError) {
      apiKey = process.env.LIVECOINWATCH_API_KEY
    }
  }

  console.log("Getting name for " + ticker)
  CRYPTO_NAME(ticker, apiKey)
}

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

  CRYPTO_TYPE(ticker)
}

// testCryptoPrice()
// testCryptoPriceOnDate()
// testCryptoName()
// testCryptoType()
