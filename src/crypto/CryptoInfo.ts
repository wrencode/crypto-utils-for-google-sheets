// import { utilGetCryptoValueFromUsd } from "../utils/CryptoInfoUtils"

// noinspection JSUnusedGlobalSymbols,JSValidateJSDoc
/**
 * Fetches the current price of a chosen cryptocurrency.
 *
 * @param {string} currencyIn - Ticker of cryptocurrency converting FROM.
 * @param {string} currencyOut - Ticker of cryptocurrency converting TO.
 * @param {string} apiKey - API key for cryptocompare.com.
 * @param {boolean} doRefresh - Unused variable used to refresh function.
 * @param {number} timestamp - Timestamp for selected date.
 *
 * @return {string} The value of the specified cryptocurrency in the specified output currency.
 *
 * @customfunction
 */
function CRYPTO_PRICE(currencyIn: string, currencyOut: string, apiKey: string, doRefresh = true, timestamp = 0) {

  if (currencyIn === "IOTA") {
    currencyIn = "MIOTA"
  }

  currencyIn = currencyIn.toLowerCase()
  currencyOut = currencyOut.toLowerCase()

  const cryptocompareAppName = "cryptoTrackerSpreadsheet"

  const edgeCaseCryptoMap: { [key: string]: string } = {
    mct: "master-contract-token",
    exit: "exodus-shares",
    tzrop: "tzero-shares",
  };

  let currencyOutValue
  let url
  let response
  let responseContent
  let responseJson
  if (!Object.keys(edgeCaseCryptoMap).includes(currencyIn)) {
    if (timestamp > 0) {
      currencyOutValue = CRYPTO_PRICE_ON_DATE(currencyIn, currencyOut, timestamp, apiKey, doRefresh)
    } else {
      // example url: https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
      url = "https://min-api.cryptocompare.com/data/price?fsym=" +
        currencyIn + "&tsyms=" + currencyOut + "&apiKey=" + apiKey + "&extraParams=" + cryptocompareAppName
      // console.log(url)
      response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true})
      // console.log(response)
      responseContent = response.getContentText()
      // console.log(responseContent)
      responseJson = JSON.parse(responseContent)
      // console.log(responseJson)

      currencyOutValue = responseJson[currencyOut.toUpperCase()]
    }

    // console.log(currencyOutValue)

    if (!currencyOutValue && timestamp === 0) {
      currencyOut = currencyOut.toLowerCase()

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
        // let cryptoIdResponseCode = response.getResponseCode()
        // console.log(cryptoIdResponseCode)
        cryptoIdResponseContent = cryptoIdResponse.getContentText()
        // console.log(cryptoIdResponseContent)
        cryptoIdResponseJson = JSON.parse(cryptoIdResponseContent)
        // console.log(cryptoIdResponseJson)

        let cryptoId = ""
        for (let crypto of cryptoIdResponseJson) {
          if (crypto.symbol.toLowerCase() === currencyIn.toLowerCase()) {
            cryptoId = crypto.id
          }
        }

        backupCryptoIdUrl = "https://api.coingecko.com/api/v3/simple/price?ids=" + cryptoId + "&vs_currencies=" + currencyOut
        // console.log(backupCryptoIdUrl)

        cryptoIdResponse = UrlFetchApp.fetch(backupCryptoIdUrl, {"muteHttpExceptions": true})
        // console.log(cryptoIdResponse)
        cryptoIdResponseContent = cryptoIdResponse.getContentText()
        // console.log(cryptoIdResponseContent)
        cryptoIdResponseJson = JSON.parse(cryptoIdResponseContent)
        // console.log(cryptoIdResponseJson)

        currencyOutValue = cryptoIdResponseJson[cryptoId][currencyOut]
      } catch (error) {
        let edgeCaseCryptoMap: { [key: string]: string } = {
          mct: "_mct",
        }
        if (Object.keys(edgeCaseCryptoMap).includes(currencyIn)) {
          currencyIn = edgeCaseCryptoMap[currencyIn]
        }
        backupCryptoIdUrl = "https://http-api.livecoinwatch.com/coins/" + currencyIn.toUpperCase() + "/info?currency=USD"
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
    if (currencyIn.toLowerCase() === "exit") {
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

      if (currencyOut.toLowerCase() === "eth") {

        if (timestamp > 0) {
          currencyOutValue = CRYPTO_PRICE_ON_DATE("usd", currencyOut, timestamp, apiKey, doRefresh)
        } else {
          // @ts-ignore
          currencyOutValue = utilGetCryptoValueFromUsd(currencyOut, currencyOutValue, apiKey, cryptocompareAppName, doRefresh)
        }
      }
    } else if (currencyIn.toLowerCase() === "tzrop") {
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

      if (currencyOut.toLowerCase() === "eth") {
        if (timestamp > 0) {
          currencyOutValue = CRYPTO_PRICE_ON_DATE("usd", currencyOut, timestamp, apiKey, doRefresh)
        } else {
          // @ts-ignore
          currencyOutValue = utilGetCryptoValueFromUsd(currencyOut, currencyOutValue, apiKey, cryptocompareAppName, doRefresh)
        }
      }
    } else {
      url = "https://crypto.com/price/coin-data/" + edgeCaseCryptoMap[currencyIn.toLowerCase()] + "/1d/latest.json"
      // console.log(url)
      response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true})
      // console.log(response)
      responseContent = response.getContentText()
      // console.log(responseContent)
      responseJson = JSON.parse(responseContent)
      // console.log(responseJson)

      let priceData = responseJson["data"]
      currencyOutValue = priceData[priceData.length - 1][1]
      console.log(currencyOutValue)
    }
  }

  currencyOutValue = Number(currencyOutValue)
  if (currencyOut.toLowerCase() === "usd") {
    console.log(currencyOutValue.toFixed(2))
  } else {
    console.log(currencyOutValue.toPrecision())
  }
  return currencyOutValue
}

// noinspection JSValidateJSDoc
/**
 * Fetches the average price of a chosen cryptocurrency on a specified date.
 *
 * @param {string} currencyIn - Ticker of cryptocurrency converting FROM.
 * @param {string} currencyOut - Ticker of cryptocurrency converting TO.
 * @param {number} timestamp - The UNIX timestamp of the desired date to fetch price for.
 * @param {string} apiKey - API key for cryptocompare.com.
 * @param {boolean} doRefresh - Unused variable used to refresh function.
 *
 * @return {string} The value of the specified cryptocurrency in the specified output currency.
 *
 * @customfunction
 */
function CRYPTO_PRICE_ON_DATE(currencyIn: string, currencyOut: string, timestamp: number, apiKey: string, doRefresh = true) {

  const appName = "cryptoTrackerSpreadsheet"

  // example url: "https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=USD&ts=1514764800&extraParams=app&calculationType=MidHighLow"
  const url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym=" +
    currencyIn + "&tsyms=" + currencyOut + "&ts=" + timestamp + "&api_key=" + apiKey + "&extraParams=" + appName + "&calculationType=MidHighLow"
  // console.log(url)
  const response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true})
  // console.log(response)
  const responseContent = response.getContentText()
  // console.log(responseContent)
  const responseJson = JSON.parse(responseContent)
  // console.log(responseJson)

  let currencyOutValue = responseJson[currencyIn.toUpperCase()][currencyOut.toUpperCase()]
  // console.log(currencyOutValue)

  currencyOutValue = Number(currencyOutValue)
  if (currencyOut.toLowerCase() === "usd") {
    console.log(currencyOutValue.toFixed(2))
  } else {
    console.log(currencyOutValue.toPrecision())
  }
  return currencyOutValue
}

// noinspection JSUnusedGlobalSymbols,JSValidateJSDoc
/**
 * Fetches full name of the chosen cryptocurrency ticker.
 *
 * @param {string} ticker - The cryptocurrency ticker for the chosen cryptocurrency.
 * @param {string} apiKey - API key for coinmarketcap.com.
 * @param {boolean} doRefresh - Unused variable used to refresh function.
 *
 * @return {string} The full name of the specified cryptocurrency.
 *
 * @customfunction
 */
function CRYPTO_NAME(ticker: string, apiKey = "", doRefresh = true) {

  ticker = ticker.toLowerCase()
  let edgeCaseCryptoMap: { [key: string]: string } = {
    iota: "miota",
    mct: "_mct",
    exit: "exodus-shares",
    tzrop: "tzero-shares",
  }

  if (ticker in edgeCaseCryptoMap) {
    ticker = edgeCaseCryptoMap[ticker]
  }

  let url = "https://http-api.livecoinwatch.com/coins/" + ticker.toUpperCase() + "/info?currency=USD"
  // let url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=" + ticker.toLowerCase()
  // const params = {
  //   'method': 'get',
  //   'accept': 'application/json',
  //   'headers': {'X-CMC_PRO_API_KEY': apiKey},
  //   'muteHttpExceptions': true
  // }
  // console.log(url)

  let name
  let response
  let responseContent
  let responseJson
  if (ticker === "exodus-shares") {
    url = "https://algoexplorerapi.io/v1/asset/213345970/info"
    // console.log(url)
    response = UrlFetchApp.fetch(url)
    // console.log(response)
    responseContent = response.getContentText()
    // console.log(responseContent)
    responseJson = JSON.parse(responseContent)
    // console.log(responseJson)

    // noinspection JSUnresolvedVariable
    name = responseJson.assetName
  } else if (ticker === "tzero-shares") {
    name = "tZERO"
  } else {
    response = UrlFetchApp.fetch(url)
    // response = UrlFetchApp.fetch(url, params) // for use with coinmarketcap.com API
    // console.log(response)
    responseContent = response.getContentText()
    // console.log(responseContent)
    responseJson = JSON.parse(responseContent)
    // console.log(responseJson)

    // name = responseJson.data[ticker.toUpperCase()].name // for use with coinmarketcap.com API
    // for (let crypto of jsonObj.cryptos) {
    //   if (crypto.symbol.toLowerCase() === ticker) {
    //     name = crypto.name
    //   }
    // }

    name = responseJson.data.name
  }

  console.log(name)
  return name
}

// noinspection JSUnusedGlobalSymbols,JSValidateJSDoc
/**
 * Fetches summarized type of the chosen cryptocurrency ticker.
 *
 * @param {string} ticker - The cryptocurrency ticker for the chosen cryptocurrency.
 * @param {boolean} doRefresh - Unused variable used to refresh function.
 *
 * @return {string} The summarized type of the specified cryptocurrency, including type, consensus mechanism, and platform where applicable.
 *
 * @customfunction
 */
function CRYPTO_TYPE(ticker: string, doRefresh: boolean = true) {

  ticker = ticker.toLowerCase()
  let edgeCaseCryptoTypesMap: { [key: string]: string } = {
    exit: "Security Token",
    tzrop: "Security Token",
    mct: "Token on NEO",
    ban: "ORV Coin",
  }

  if (ticker === "iota") {
    ticker = "miota"
  }

  let type
  if (ticker in edgeCaseCryptoTypesMap) {
    type = edgeCaseCryptoTypesMap[ticker]
  } else {
    const url = "https://http-api.livecoinwatch.com/coins/" + ticker.toUpperCase() + "/info?currency=USD"
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
