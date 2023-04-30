// noinspection DuplicatedCode

// import { utilGetCryptoValueFromUsd, isNumber } from "../utils/CryptoInfoUtils"

// noinspection JSUnusedGlobalSymbols,JSValidateJSDoc
/**
 * Retrieve current price of the selected cryptocurrency.
 *
 * @param {string} currencyTickerIn - Ticker of input cryptocurrency for which the price is to be retrieved.
 * @param {string} currencyTickerOut - Ticker of output cryptocurrency/fiat currency in which to represent the price of the input cryptocurrency.
 * @param {string} apiKey - Personal API key for CryptoCompare.com.
 * @param {number} timestamp - The UNIX timestamp of the desired date for which to retrieve the price of the input cryptocurrency.
 * @param {boolean} [doRefresh] - Variable used to refresh function (can be any value that changes).
 *
 * @return {string} The value of the input cryptocurrency in the output cryptocurrency/fiat currency.
 *
 * @customfunction
 */
function CRYPTO_PRICE(currencyTickerIn: string, currencyTickerOut: string, apiKey: string, timestamp = 0, doRefresh = true) {

  if (currencyTickerIn === "IOTA") {
    currencyTickerIn = "MIOTA"
  }

  currencyTickerIn = currencyTickerIn.toLowerCase()
  currencyTickerOut = currencyTickerOut.toLowerCase()

  const cryptocompareAppName = "cryptoTrackerSpreadsheet"

  const edgeCaseCryptoMap: { [key: string]: string } = {
    mct: "mct",
    exit: "exodus-shares",
    tzrop: "tzero-shares",
  };

  let currencyOutValue
  let url
  let response
  let responseContent
  let responseJson
  if (!Object.keys(edgeCaseCryptoMap).includes(currencyTickerIn)) {

    // @ts-ignore
    if (isNumber(timestamp) && timestamp > 0) {
      currencyOutValue = CRYPTO_PRICE_ON_DATE(currencyTickerIn, currencyTickerOut, apiKey, timestamp, doRefresh)
    } else {
      // example url: https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
      url = "https://min-api.cryptocompare.com/data/price?fsym=" +
        currencyTickerIn + "&tsyms=" + currencyTickerOut + "&apiKey=" + apiKey + "&extraParams=" + cryptocompareAppName
      // console.log(url)
      response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true})
      // console.log(response)
      responseContent = response.getContentText()
      // console.log(responseContent)
      responseJson = JSON.parse(responseContent)
      // console.log(responseJson)

      currencyOutValue = responseJson[currencyTickerOut.toUpperCase()]
    }

    // console.log(currencyOutValue)

    // @ts-ignore
    if (!currencyOutValue && (timestamp === 0 || !isNumber(timestamp))) {
      currencyTickerOut = currencyTickerOut.toLowerCase()

      let cryptoIdUrl
      let backupCryptoIdUrl
      let cryptoIdResponse
      let cryptoIdResponseContent
      let cryptoIdResponseJson
      try {
        cryptoIdUrl = "https://api.coingecko.com/api/v3/coins/list?include_platform=false"
        // console.log(cryptoIdUrl)
        cryptoIdResponse = UrlFetchApp.fetch(cryptoIdUrl, {"muteHttpExceptions": true})
        // console.log(cryptoIdResponse)
        cryptoIdResponseContent = cryptoIdResponse.getContentText()
        // console.log(cryptoIdResponseContent)
        cryptoIdResponseJson = JSON.parse(cryptoIdResponseContent)
        // console.log(cryptoIdResponseJson)

        let cryptoId = ""
        for (let crypto of cryptoIdResponseJson) {
          if (crypto.symbol.toLowerCase() === currencyTickerIn.toLowerCase()) {
            cryptoId = crypto.id
          }
        }

        backupCryptoIdUrl = "https://api.coingecko.com/api/v3/simple/price?ids=" + cryptoId + "&vs_currencies=" + currencyTickerOut
        // console.log(backupCryptoIdUrl)

        cryptoIdResponse = UrlFetchApp.fetch(backupCryptoIdUrl, {"muteHttpExceptions": true})
        // console.log(cryptoIdResponse)
        cryptoIdResponseContent = cryptoIdResponse.getContentText()
        // console.log(cryptoIdResponseContent)
        cryptoIdResponseJson = JSON.parse(cryptoIdResponseContent)
        // console.log(cryptoIdResponseJson)

        currencyOutValue = cryptoIdResponseJson[cryptoId][currencyTickerOut]
      } catch (error) {
        let edgeCaseCryptoMap: { [key: string]: string } = {
          mct: "_mct",
        }
        if (Object.keys(edgeCaseCryptoMap).includes(currencyTickerIn)) {
          currencyTickerIn = edgeCaseCryptoMap[currencyTickerIn]
        }
        backupCryptoIdUrl = "https://http-api.livecoinwatch.com/coins/" + currencyTickerIn.toUpperCase() + "/info?currency=USD"
        // console.log(backupCryptoIdUrl)
        cryptoIdResponse = UrlFetchApp.fetch(backupCryptoIdUrl, {"muteHttpExceptions": true})
        // console.log(cryptoIdResponse)
        cryptoIdResponseContent = cryptoIdResponse.getContentText()
        // console.log(cryptoIdResponseContent)
        cryptoIdResponseJson = JSON.parse(cryptoIdResponseContent)
        // console.log(cryptoIdResponseJson)

        // noinspection JSUnresolvedVariable
        currencyOutValue = cryptoIdResponseJson.data.plot.day.slice(-1)[0]
      }
      console.log(currencyOutValue)
    }
  } else {
    if (currencyTickerIn.toLowerCase() === "exit") {
      url = "https://pricing.a.exodus.io/current-price?from=EXIT&to=USD"
      // console.log(url)
      response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true})
      // console.log(response)
      responseContent = response.getContentText()
      // console.log(responseContent)
      responseJson = JSON.parse(responseContent)
      // console.log(responseJson)

      currencyOutValue = responseJson["EXIT"]["USD"]
      console.log(currencyOutValue)

      if (currencyTickerOut.toLowerCase() === "eth") {
        // @ts-ignore
        if (isNumber(timestamp) && timestamp > 0) {
          currencyOutValue = CRYPTO_PRICE_ON_DATE("usd", currencyTickerOut, apiKey, timestamp, doRefresh)
        } else {
          // @ts-ignore
          currencyOutValue = utilGetCryptoValueFromUsd(currencyTickerOut, currencyOutValue, apiKey, cryptocompareAppName, doRefresh)
        }
      }
    } else if (currencyTickerIn.toLowerCase() === "tzrop") {
      url = "https://stomarket.com/sto/tZERO"
      // console.log(url)
      response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true})
      // console.log(response)
      responseContent = response.getContentText()
      // console.log(responseContent)
      let regExp = new RegExp('(class="tickerheadline">)(.*?)(<small)', 'gis')
      let result = regExp.exec(responseContent)
      // currencyOutValue = Number(result[0].split(/\$| /)[1])
      currencyOutValue = Number(result![0].split(/[$ ]/)[1])
      console.log(currencyOutValue)

      if (currencyTickerOut.toLowerCase() === "eth") {
        // @ts-ignore
        if (isNumber(timestamp) && timestamp > 0) {
          currencyOutValue = CRYPTO_PRICE_ON_DATE("usd", currencyTickerOut, apiKey, timestamp, doRefresh)
        } else {
          // @ts-ignore
          currencyOutValue = utilGetCryptoValueFromUsd(currencyTickerOut, currencyOutValue, apiKey, cryptocompareAppName, doRefresh)
        }
      }
    } else if (currencyTickerIn.toLowerCase() === "mct") {
      url = "https://coincodex.com/api/coincodex/get_coin/" + edgeCaseCryptoMap[currencyTickerIn.toLowerCase()]
      // console.log(url)
      response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true})
      // console.log(response)
      responseContent = response.getContentText()
      // console.log(responseContent)
      responseJson = JSON.parse(responseContent)
      // console.log(responseJson)

      currencyOutValue = responseJson.last_price_usd
      console.log(currencyOutValue)
    }
  }

  currencyOutValue = Number(currencyOutValue)
  if (currencyTickerOut.toLowerCase() === "usd") {
    console.log(currencyOutValue.toFixed(2))
  } else {
    console.log(currencyOutValue.toPrecision())
  }
  return currencyOutValue
}

// noinspection JSValidateJSDoc
/**
 * Retrieve average price of the selected cryptocurrency on a specified date.
 *
 * @param {string} currencyTickerIn - Ticker of input cryptocurrency for which the price is to be retrieved.
 * @param {string} currencyTickerOut - Ticker of output cryptocurrency/fiat currency in which to represent the price of the input cryptocurrency.
 * @param {string} apiKey - Personal API key for CryptoCompare.com.
 * @param {number} timestamp - The UNIX timestamp of the desired date for which to retrieve the price of the input cryptocurrency.
 * @param {boolean} [doRefresh] - Variable used to refresh function (can be any value that changes).
 *
 * @return {string} The value of the input cryptocurrency in the output cryptocurrency/fiat currency on the specified date.
 *
 * @customfunction
 */
function CRYPTO_PRICE_ON_DATE(currencyTickerIn: string, currencyTickerOut: string, apiKey: string, timestamp: number, doRefresh = true) {

  const appName = "cryptoTrackerSpreadsheet"

  // example url: "https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=USD&ts=1514764800&extraParams=app&calculationType=MidHighLow"
  const url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym=" +
    currencyTickerIn + "&tsyms=" + currencyTickerOut + "&ts=" + timestamp + "&api_key=" + apiKey + "&extraParams=" + appName + "&calculationType=MidHighLow"
  // console.log(url)
  const response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true})
  // console.log(response)
  const responseContent = response.getContentText()
  // console.log(responseContent)
  const responseJson = JSON.parse(responseContent)
  // console.log(responseJson)

  let currencyOutValue = responseJson[currencyTickerIn.toUpperCase()][currencyTickerOut.toUpperCase()]
  // console.log(currencyOutValue)

  currencyOutValue = Number(currencyOutValue)
  if (currencyTickerOut.toLowerCase() === "usd") {
    console.log(currencyOutValue.toFixed(2))
  } else {
    console.log(currencyOutValue.toPrecision())
  }
  return currencyOutValue
}

// noinspection JSUnusedGlobalSymbols,JSValidateJSDoc
/**
 * Retrieve full name of the selected cryptocurrency ticker.
 *
 * @param {string} cryptocurrencyTicker - Ticker of input cryptocurrency for which to retrieve the full name.
 * @param {boolean} [doRefresh] - Variable used to refresh function (can be any value that changes).
 *
 * @return {string} The full name of the selected cryptocurrency ticker.
 *
 * @customfunction
 */
function CRYPTO_NAME(cryptocurrencyTicker: string, doRefresh = true) {

  cryptocurrencyTicker = cryptocurrencyTicker.toLowerCase()
  let edgeCaseCryptoMap: { [key: string]: string } = {
    iota: "miota",
    mct: "_mct",
    exit: "exodus-shares",
    tzrop: "tzero-shares",
  }

  if (cryptocurrencyTicker in edgeCaseCryptoMap) {
    cryptocurrencyTicker = edgeCaseCryptoMap[cryptocurrencyTicker]
  }

  let url = "https://http-api.livecoinwatch.com/coins/" + cryptocurrencyTicker.toUpperCase() + "/info?currency=USD"

  let name
  let response
  let responseContent
  let responseJson
  if (cryptocurrencyTicker === "exodus-shares") {
    url = "https://node.algoexplorerapi.io/v2/assets/213345970"
    // console.log(url)
    response = UrlFetchApp.fetch(url)
    // console.log(response)
    responseContent = response.getContentText()
    // console.log(responseContent)
    responseJson = JSON.parse(responseContent)
    // console.log(responseJson)

    // noinspection JSUnresolvedVariable
    name = responseJson.params.name
  } else if (cryptocurrencyTicker === "tzero-shares") {
    name = "tZERO"
  } else {
    response = UrlFetchApp.fetch(url)
    // console.log(response)
    responseContent = response.getContentText()
    // console.log(responseContent)
    responseJson = JSON.parse(responseContent)
    // console.log(responseJson)

    name = responseJson.data.name
  }
  console.log(name)
  return name
}

// noinspection JSUnusedGlobalSymbols,JSValidateJSDoc
/**
 * Retrieve summarized type of the selected cryptocurrency ticker (where available).
 *
 * @param {string} cryptocurrencyTicker - Ticker of input cryptocurrency for which to retrieve the summarized type.
 * @param {boolean} [doRefresh] - Variable used to refresh function (can be any value that changes).
 *
 * @return {string} The summarized type, consensus mechanism, and platform (where applicable and available) of the selected cryptocurrency ticker.
 *
 * @customfunction
 */
function CRYPTO_TYPE(cryptocurrencyTicker: string, doRefresh: boolean = true) {

  cryptocurrencyTicker = cryptocurrencyTicker.toLowerCase()
  let edgeCaseCryptoTypesMap: { [key: string]: string } = {
    exit: "Security Token",
    tzrop: "Security Token",
    mct: "Token on NEO",
    ban: "ORV Coin",
  }

  if (cryptocurrencyTicker === "iota") {
    cryptocurrencyTicker = "miota"
  }

  let type
  if (cryptocurrencyTicker in edgeCaseCryptoTypesMap) {
    type = edgeCaseCryptoTypesMap[cryptocurrencyTicker]
  } else {
    const url = "https://http-api.livecoinwatch.com/coins/" + cryptocurrencyTicker.toUpperCase() + "/info?currency=USD"
    // console.log(url)
    const response = UrlFetchApp.fetch(url)
    // console.log(response)
    const responseContent = response.getContentText()
    // console.log(responseContent)
    const responseJson = JSON.parse(responseContent)
    // console.log(responseJson)

    if ("implementation" in responseJson.data) {
      let implementation = responseJson.data.implementation
      let typeArray = []
      if ("proof" in implementation) {
        if (implementation.proof) {
          typeArray.push(implementation.proof)
        }
      }
      if ("type" in implementation) {
        if (implementation.type) {
          typeArray.push(implementation.type.charAt(0).toUpperCase() + implementation.type.slice(1))
        }
      }
      if ("platform" in implementation) {
        if (implementation.platform) {
          // noinspection JSUnresolvedVariable
          if (!implementation.proof && !implementation.type) {
            typeArray.push("Token")
          }
          typeArray.push("on")
          typeArray.push(implementation.platform)
        }
      }
      if ("chains" in implementation && !("proof" in implementation) && !("type" in implementation) && !("platform" in implementation)) {
        if (implementation.chains && implementation.chains.length) {
          typeArray.push(...["Token", "on"])
          typeArray.push(implementation.chains[0].platform)
        }
      }

      type = typeArray.join(" ")

    } else {
      type = "?"
    }
  }

  console.log(type)
  return type
}

export {CRYPTO_PRICE, CRYPTO_PRICE_ON_DATE, CRYPTO_NAME, CRYPTO_TYPE}
