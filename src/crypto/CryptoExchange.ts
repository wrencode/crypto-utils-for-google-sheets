// noinspection DuplicatedCode

// import { utilParseExchanges, utilConvertByteStrToHexStr, utilHasSufficientValue } from "../utils/CryptoExchangeUtils"

// noinspection JSValidateJSDoc
/**
 * Retrieve cryptocurrency exchange balance(s) for chosen asset.
 *
 * @param {string} cryptocurrency - The ticker for the selected cryptocurrency.
 * @param {string} exchanges - Comma-separated list of exchanges as string from which to retrieve balances.
 * @param {string} exchangesApiCredentials - Comma-separated list of exchange API credentials (formatted as name:key:secret, or name:key:secret:password) as string. * @param {boolean} doRefresh - Unused variable used to refresh function.
 * @param {boolean} doRefresh - Unused variable used to refresh function.
 *
 * @return {number} - The total amount of the cryptocurrency stored across all selected exchanges.
 *
 * @customfunction
 */
function CRYPTO_EXCHANGE_BALANCE(cryptocurrency: string, exchanges: string, exchangesApiCredentials: string, doRefresh = true) {

  // @ts-ignore
  let exchangesArray = utilParseExchanges(exchanges)
  console.log(exchangesArray)

  let exchangeFunctionMap = getCryptoExchangeBalanceFunctions(exchangesApiCredentials)

  let randomDelay = Math.floor(Math.random() * 1000)
  Utilities.sleep(randomDelay)

  let totalAmount = 0.0
  // noinspection JSDeprecatedSymbols
  if (Array.isArray(exchangesArray) && exchangesArray.length) {
    for (let exchange of exchangesArray) {
      let amount
      if (exchangeFunctionMap.hasOwnProperty(exchange.toLowerCase())) {
        amount = exchangeFunctionMap[exchange](cryptocurrency)
      } else {
        throw "Exchange " + exchange.toUpperCase() + " is not yet supported or you have not supplied an API key & secret for it! " +
        "Call CRYPTO_EXCHANGES to get an array of currently supported exchanges."
      }
      if (!isNaN(amount)){
        totalAmount += amount
      } else {
        throw "Retrieval of cryptocurrency " + cryptocurrency + " failed. " +
        "It is possible that there was a problem with an exchange API used to retrieve balances of this asset."
      }
    }
  }
  console.log(`Total amount of ${cryptocurrency.toUpperCase()} on exchanges (${exchangesArray.join(", ")}): ${totalAmount.toPrecision()}`)
  return totalAmount
}

// noinspection JSUnusedGlobalSymbols,JSValidateJSDoc
/**
 * All supported exchanges of CRYPTO_EXCHANGE_BALANCE.
 *
 * @param {string} exchangesApiCredentials - Comma-separated list of exchange API credentials (formatted as name:key:secret, or name:key:secret:password) as string. * @param {boolean} doRefresh - Unused variable used to refresh function.
 * @param {boolean} doRefresh - Unused variable used to refresh function.
 *
 * @return {array} - An array of all supported exchanges supported by CRYPTO_EXCHANGE_BALANCE.
 *
 * @customfunction
 */
function CRYPTO_EXCHANGES(exchangesApiCredentials: string, doRefresh = true) {
  let exchangesArray = Object.keys(getCryptoExchangeBalanceFunctions(exchangesApiCredentials))
  console.log(exchangesArray)
  return exchangesArray.sort()
}

// noinspection JSValidateJSDoc
/**
 * Retrieve supported exchange function array for CRYPTO_EXCHANGE_BALANCE.
 *
 * @param {string} exchangesApiCredentials - Comma-separated list of exchange API credentials (formatted as name:key:secret, or name:key:secret:password) as string. * @param {boolean} doRefresh - Unused variable used to refresh function.
 *
 * @return {object} - All exchanges supported by CRYPTO_EXCHANGE_BALANCE and their curried functions.
 */
function getCryptoExchangeBalanceFunctions(exchangesApiCredentials: string) {

  interface IApi {
    apiKey: string;
    apiSecret: string;
    apiPass: string | null;
  }

  let apiDict: { [key: string]: IApi } = {}
  const exchangesApiCredentialsArray = exchangesApiCredentials.split(",")
  for (let exchangeApiCredentials of exchangesApiCredentialsArray) {
    const exchangeApiCredentialsArray = exchangeApiCredentials.split(":")

   if (exchangeApiCredentialsArray.length === 3) {
      apiDict[exchangeApiCredentialsArray[0]] = {
        apiKey: exchangeApiCredentialsArray[1],
        apiSecret: exchangeApiCredentialsArray[2],
        apiPass: null
      }
    } else if (exchangeApiCredentialsArray.length === 4) {
      apiDict[exchangeApiCredentialsArray[0]] = {
        apiKey: exchangeApiCredentialsArray[1],
        apiSecret: exchangeApiCredentialsArray[2],
        apiPass: exchangeApiCredentialsArray[3]
      }
    }
  }

  // const apis = SpreadsheetApp
  //   .getActiveSpreadsheet()
  //   .getSheetByName("apis")
  //   .getRange("A:D")
  //   .getValues()
  // // console.log(apis)
  //
  // let apiDict: { [key: string]: string } = {}
  // for (let api of apis) {
  //   if (api[0] !== '') {
  //     // console.log(api)
  //     apiDict[api[0]] = api.slice(1)
  //   }
  // }
  // console.log(apiDict)

  const cryptoExchangeBalanceFunctionMap: { [key: string]: Function } = {
    "binance-us": fetchBinanceUsBalance,
    "kucoin": fetchKucoinBalance,
    "kraken": fetchKrakenBalance,
    "bittrex": fetchBittrexBalance,
    "coinbase": fetchCoinbaseBalance,
    "coinbase-pro": fetchCoinbaseProBalance,
    "gemini": fetchGeminiBalance,
    "tzero": fetchTzeroBalance,
    "coinex": fetchCoinExBalance,
    "mexc": fetchMexcBalance,
  }

  let cryptoExchangeBalanceFunctions: { [key: string]: Function } = {}
  for (let [key, value] of Object.entries(apiDict)) {
    if (cryptoExchangeBalanceFunctionMap.hasOwnProperty(key)) {
      if (value.apiPass != null) {
        cryptoExchangeBalanceFunctions[key] = cryptoExchangeBalanceFunctionMap[key](
            value.apiKey,
            value.apiSecret,
            value.apiPass
        )
      } else {
        cryptoExchangeBalanceFunctions[key] = cryptoExchangeBalanceFunctionMap[key](
            value.apiKey,
            value.apiSecret
        )
      }
    }
  }
  // const cryptoExchangeBalanceFunctionsA: { [key: string]: Function } = {
  //   "binance-us": fetchBinanceUsBalance(
  //     apiDict["binance-us"].apiKey,
  //     apiDict["binance-us"].apiSecret
  //   ),
  //   "kucoin": fetchKucoinBalance(
  //     apiDict["kucoin"].apiKey,
  //     apiDict["kucoin"].apiSecret,
  //     apiDict["kucoin"].apiPass!,
  //   ),
  //   "kraken": fetchKrakenBalance(
  //     apiDict["kraken"].apiKey,
  //     apiDict["kraken"].apiSecret
  //   ),
  //   "bittrex": fetchBittrexBalance(
  //     apiDict["bittrex"].apiKey,
  //     apiDict["bittrex"].apiSecret
  //   ),
  //   "coinbase": fetchCoinbaseBalance(
  //     apiDict["coinbase"].apiKey,
  //     apiDict["coinbase"].apiSecret
  //   ),
  //   "coinbase-pro": fetchCoinbaseProBalance(
  //     apiDict["coinbase-pro"].apiKey,
  //     apiDict["coinbase-pro"].apiSecret,
  //     apiDict["coinbase-pro"].apiPass!
  //   ),
  //   "gemini": fetchGeminiBalance(
  //     apiDict["gemini"].apiKey,
  //     apiDict["gemini"].apiSecret
  //   ),
  //   "tzero": fetchTzeroBalance(
  //     apiDict["tzero"].apiKey,
  //     apiDict["tzero"].apiSecret,
  //     apiDict["tzero"].apiPass!
  //   ),
  //   "coinex": fetchCoinExBalance(
  //       apiDict["coinex"].apiKey,
  //       apiDict["coinex"].apiSecret
  //   ),
  //   "mexc": fetchMexcBalance(
  //     apiDict["mexc"].apiKey,
  //     apiDict["mexc"].apiSecret
  //   ),
  // }

  return cryptoExchangeBalanceFunctions
}

// noinspection JSValidateJSDoc
/**
 * Fetches cryptocurrency balance from the Binance exchange.
 *
 * @param {string} apiKey - Personal Binance API key.
 * @param {string} apiSecret - Personal Binance API secret.
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchBinanceUsBalance(apiKey: string, apiSecret: string) {
  /**
   * Fetches cryptocurrency balance from the Binance.US exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   * @return {number} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency: string) {
    let curTime = new Date().getTime()
    let timestamp = "timestamp=" + curTime

    let signature = Utilities.computeHmacSha256Signature(timestamp, apiSecret)
    let signatureStr = signature.map(function(e) {
      let v = (e < 0 ? e + 256 : e).toString(16)
      return v.length === 1 ? "0" + v : v
    }).join("")
    // console.log("Signature: " + signatureStr)

    const params: { [key: string]: string | boolean | object } = {
      "method": "GET",
      "accept": "application/json",
      "headers": {"X-MBX-APIKEY": apiKey},
      "muteHttpExceptions": true
    }
    // make sure to use the binance.us API endpoint for Binance.us accounts
    let url = "https://api.binance.us/api/v3/account?" + timestamp + "&signature=" + signatureStr
    // console.log(url)
    let response = UrlFetchApp.fetch(url, params)
    // console.log(response)
    let responseContent = response.getContentText()
    // console.log(responseContent)
    let responseJson = JSON.parse(responseContent)
    // console.log(responseJson)

    // noinspection JSUnresolvedVariable
    let balances = responseJson.balances
    // console.log(balances)

    let total = 0
    for (let balance of balances) {
      if (balance.asset.toLowerCase() === cryptocurrency.toLowerCase()) {
        // console.log(balance)
        let balanceTotal = parseFloat(balance.free) + parseFloat(balance.locked)
        // @ts-ignore
        if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
          total += balanceTotal
        }
      }
    }
    console.log(`Total ${cryptocurrency.toUpperCase()} on Binance.US: ${total}`)
    return total
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches cryptocurrency balance from the KuCoin exchange.
 *
 * @param {string} apiKey - Personal KuCoin API key.
 * @param {string} apiSecret - Personal KuCoin API secret.
 * @param {string} apiPassphrase - Personal KuCoin API passphrase.
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchKucoinBalance(apiKey: string, apiSecret: string, apiPassphrase: string) {
  /**
   * Fetches cryptocurrency balance from the KuCoin exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   * @return {float} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency: string) {
    //var host = 'https://api.kucoin.com'
    const host = "https://openapi-v2.kucoin.com"
    const endpoint = "/api/v1/accounts"

    const nonce = Date.now() + ""
    const stringToSign = nonce + "GET" + endpoint
    // console.log(stringToSign)

    const secret = Utilities.newBlob(apiSecret).getDataAsString()

    let signature = Utilities.computeHmacSha256Signature(stringToSign, secret)
    let signatureStr = Utilities.base64Encode(signature)
    // console.log("Signature: " + signatureStr)

    let passphrase = Utilities.computeHmacSha256Signature(apiPassphrase, secret, Utilities.Charset.UTF_8)
    let passphraseStr = Utilities.base64Encode(passphrase)
    // console.log("Passphrase: " + passphraseStr)

    const url = host + endpoint
    // console.log(url)
    const params = {
      "headers" : {
        "KC-API-SIGN": signatureStr,
        "KC-API-TIMESTAMP": nonce,
        "KC-API-KEY": apiKey,
        "KC-API-PASSPHRASE": passphraseStr,
        "KC-API-KEY-VERSION": "2"
      },
      "muteHttpExceptions": true
    }

    const response = UrlFetchApp.fetch(url, params)
    // console.log(response)
    const responseContent = response.getContentText()
    // console.log(responseContent)
    const responseJson = JSON.parse(responseContent)
    // console.log(responseJson)

    const balances = responseJson.data
    // console.log(balances)

    let total = 0
    for (let balance of balances) {
      if (balance.currency.toLowerCase() === cryptocurrency.toLowerCase()) {
        // noinspection JSUnresolvedVariable
        let balanceTotal = parseFloat(balance.balance)
        // @ts-ignore
        if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
          total += balanceTotal
        }
      }
    }
    console.log(`Total ${cryptocurrency.toUpperCase()} on KuCoin: ${total}`)
    return total
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches cryptocurrency balance from the Kraken exchange.
 *
 * @param {string} apiKey - Personal Kraken API key.
 * @param {string} apiSecret - Personal Kraken API secret.
 *
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchKrakenBalance(apiKey: string, apiSecret: string) {
  /**
   * Fetches cryptocurrency balance from the Kraken exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   *
   * @return {float} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency: string) {
    const host = "https://api.kraken.com"
    const endpoint = "/0/private/Balance"
    const url = host + endpoint
    // console.log(url)

    const nonce = new Date().getTime() * 1000
    const payload = "nonce=" + nonce + "&" + ""
    // console.log("Payload: " + payload)
    const encodedBody = Utilities.newBlob(endpoint).getBytes().concat(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, nonce + payload))
    // console.log("Encoded body: " + encodedBody)

    const signature = Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_512, encodedBody, Utilities.base64Decode(apiSecret))
    // console.log("Signature: " + signature)

    const params: { [key: string]: string | boolean | object } = {
      "method": "post",
      "payload": payload,
      "headers" : {
        "API-Key": apiKey,
        "API-Sign": Utilities.base64Encode(signature)
      },
      "muteHttpExceptions": true
    }

    const response = UrlFetchApp.fetch(url, params)
    // console.log(response)
    const responseContent = response.getContentText()
    // console.log(responseContent)
    const responseJson = JSON.parse(responseContent)
    // console.log(responseJson)

    const balances = responseJson.result
    // console.log(balances)

    let total = 0
    for (let [key, value] of Object.entries(balances)) {
      // For older listed cryptos, Kraken starts the ticker with "X", and for fiat currencies, starts it with "Z"
      // See: https://support.kraken.com/hc/en-us/articles/360001185506-How-to-interpret-asset-codes
      if (cryptocurrency.toLowerCase() === key.toLowerCase() || (cryptocurrency.toLowerCase() === key.slice(1).toLowerCase() && key.charAt(0) === "X")) {
        // @ts-ignore
        let balanceTotal = parseFloat(value)
        // @ts-ignore
        if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
          total += balanceTotal
        }
      }
    }
    console.log(`Total ${cryptocurrency.toUpperCase()} on Kraken: ${total}`)
    return total
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches cryptocurrency balance from the Bittrex exchange.
 * Code snippets taken from https://github.com/moosylog/exchange_collectors/blob/master/bittrex.gs
 *
 * @param {string} apiKey - Personal Bittrex API key.
 * @param {string} apiSecret - Personal Bittrex API secret.
 *
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchBittrexBalance(apiKey: string, apiSecret: string) {
  /**
   * Fetches cryptocurrency balance from the Bittrex exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   *
   * @return {float} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency: string) {
    const host = "https://api.bittrex.com/v3"
    const endpoint = "/balances/" + cryptocurrency
    const url = host + endpoint
    // console.log(url)

    const nonce = new Date().getTime().toString()
    const payload = ""
    // @ts-ignore
    const contentHash = utilConvertByteStrToHexStr(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_512, payload)).toString()
    // @ts-ignore
    const signature = utilConvertByteStrToHexStr(Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_512, nonce + host + endpoint + "GET" + contentHash, apiSecret)).toString()

    const params: { [key: string]: string | boolean | object } = {
      "method": "GET",
      "muteHttpExceptions": true,
      "headers": {
        "Api-Key": apiKey,
        "Api-Timestamp": nonce,
        "Api-Content-Hash": contentHash,
        "Api-Signature": signature,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      "payload": payload
    }

    const response = UrlFetchApp.fetch(url, params)
    // console.log(response)
    const responseContent = response.getContentText()
    // console.log(responseContent)
    const responseJson = JSON.parse(responseContent)
    // console.log(responseJson)
    let total = parseFloat(responseJson.total)

    // @ts-ignore
    if (!utilHasSufficientValue(cryptocurrency, total)) {
      total = 0
    }

    console.log(`Total ${cryptocurrency.toUpperCase()} on Bittrex: ${total}`)
    return total
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches cryptocurrency balance from the Coinbase exchange.
 * Code snippets taken from https://github.com/moosylog/exchange_collectors/blob/master/coinbase.gs
 *
 * @param {string} apiKey - Personal Coinbase API key.
 * @param {string} apiSecret - Personal Coinbase API secret.
 *
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchCoinbaseBalance(apiKey: string, apiSecret: string) {
  /**
   * Fetches cryptocurrency balance from the Coinbase exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   *
   * @return {float} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency: string) {
    const host = "https://api.coinbase.com"
    const endpoint = "/v2/accounts"
    const url = host + endpoint
    // console.log(url)

    const nonce = Math.floor((new Date().getTime() / 1000)).toString()
    const payload = nonce + "GET" + endpoint + ""
    // @ts-ignore
    const signature = utilConvertByteStrToHexStr(Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_256, payload, apiSecret)).toString()
    const params: { [key: string]: string | boolean | object } = {
      "method": "GET",
      "muteHttpExceptions": true,
      "headers": {
        "Content-Type": "application/json",
        "CB-ACCESS-SIGN": signature,
        "CB-ACCESS-TIMESTAMP": nonce,
        "CB-ACCESS-KEY": apiKey,
        "CB-VERSION": "2020-04-18"
      }
    }

    const response = UrlFetchApp.fetch(url, params)
    // console.log(response)
    const responseContent = response.getContentText()
    // console.log(responseContent)
    const responseJson = JSON.parse(responseContent)
    // console.log(responseJson)
    const balances = responseJson.data
    // console.log(balances)

    let total = 0
    for (let balance of balances) {
      // noinspection JSUnresolvedVariable
      if (balance.balance.currency.toLowerCase() === cryptocurrency.toLowerCase()) {
        // noinspection JSUnresolvedVariable
        let balanceTotal = parseFloat(balance.balance.amount)
        // @ts-ignore
        if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
          total += balanceTotal
        }
      }
    }
    console.log(`Total ${cryptocurrency.toUpperCase()} on Coinbase: ${total}`)

    // let endpoint = "https://www.coinbase.com/graphql/query?&operationName=rewardsQuery&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%2255e68bb3ecebdbd4391ee8c51071c2ad8aef85d97448abd8851fbf5110c2a834%22%7D%7D&variables=%7B%22skip%22%3Afalse%2C%22nativeCurrency%22%3A%22USD%22%7D"
    // var url = host + endpoint

    return total
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches cryptocurrency balance from the Coinbase Pro exchange.
 *
 * @param {string} apiKey - Personal Coinbase Pro API key.
 * @param {string} apiSecret - Personal Coinbase Pro API secret.
 * @param {string} apiPassphrase - Personal Coinbase Pro API passphrase.
 *
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchCoinbaseProBalance(apiKey: string, apiSecret: string, apiPassphrase: string) {
  /**
   * Fetches cryptocurrency balance from the Coinbase Pro exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   *
   * @return {float} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency: string) {
    const host = "https://api.pro.coinbase.com"
    const endpoint = "/accounts"
    const url = host + endpoint
    // console.log(url)

    const nonce = Math.floor((new Date().getTime() / 1000)).toString()
    const signature = Utilities.base64Encode(Utilities.computeHmacSha256Signature(Utilities.base64Decode(Utilities.base64Encode(nonce + "GET" + endpoint + "")), Utilities.base64Decode(apiSecret)))

    const params: { [key: string]: string | boolean | object } = {
      "method": "GET",
      "muteHttpExceptions": true,
      "headers": {
        "CB-ACCESS-KEY": apiKey,
        "CB-ACCESS-SIGN": signature,
        "CB-ACCESS-TIMESTAMP": nonce,
        "CB-ACCESS-PASSPHRASE": apiPassphrase,
        "Content-Type": "application/json",
      }
    }

    const response = UrlFetchApp.fetch(url, params)
    // console.log(response)
    const responseContent = response.getContentText()
    // console.log(responseContent)
    const responseJson = JSON.parse(responseContent)
    // console.log(JSON.stringify(responseJson, null, 2))

    let total = 0
    for (let balance of responseJson) {
      if (balance.currency.toLowerCase() === cryptocurrency.toLowerCase()) {
        // noinspection JSUnresolvedVariable
        let balanceTotal = parseFloat(balance.balance)
        // @ts-ignore
        if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
          total += balanceTotal
        }
      }
    }
    console.log(`Total ${cryptocurrency.toUpperCase()} on Coinbase Pro: ${total}`)
    return total
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches cryptocurrency balance from the Gemini exchange.
 * Code snippets taken from https://github.com/moosylog/exchange_collectors/blob/master/gemini.gs
 *
 * @param {string} apiKey - Personal Gemini API key.
 * @param {string} apiSecret - Personal Gemini API secret.
 *
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchGeminiBalance(apiKey: string, apiSecret: string) {
  /**
   * Fetches cryptocurrency balance from the Gemini exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   *
   * @return {float} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency: string) {
    const host = "https://api.gemini.com"
    const endpoint = "/v1/balances"
    const url = host + endpoint
    // console.log(url)

    const nonce = new Date().getTime()
    const payload = {"request": endpoint, "nonce": nonce}
    // @ts-ignore
    const signature = utilConvertByteStrToHexStr(Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_384, Utilities.base64Encode(JSON.stringify(payload)), apiSecret)).toString()

    const params: { [key: string]: string | boolean | object } = {
      "method": "post",
      "muteHttpExceptions": true,
      "Content-Type": "text/plain",
      "headers": {
        "X-GEMINI-APIKEY": apiKey,
        "X-GEMINI-PAYLOAD": Utilities.base64Encode(JSON.stringify(payload)),
        "X-GEMINI-SIGNATURE": signature,
        "Cache-Control": "no-cache"
      }
    }

    const response = UrlFetchApp.fetch(url, params)
    // console.log(response)
    const responseContent = response.getContentText()
    // console.log(responseContent)
    const responseJson = JSON.parse(responseContent)
    // console.log(JSON.stringify(responseJson, null, 2))

    let total = 0
    for (let balance of responseJson) {
      if (balance.currency.toLowerCase() === cryptocurrency.toLowerCase()) {
        let balanceTotal = parseFloat(balance.amount)
        // @ts-ignore
        if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
          total += balanceTotal
        }
      }
    }
    console.log(`Total ${cryptocurrency.toUpperCase()} on Gemini: ${total}`)
    return total
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches cryptocurrency security asset balance from the tZERO exchange.
 *
 * @param {string} userEmail - tZERO user email.
 * @param {string} userPassword - tZERO user password.
 * @param {string} userDeviceFingerprint - tZERO unique device fingerprint.
 *
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency security asset stored on the exchange.
 */
function fetchTzeroBalance(userEmail: string, userPassword: string, userDeviceFingerprint: string) {
  /**
   * Fetches cryptocurrency security asset balance from the tZERO exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency security asset for which to retrieve the balance.
   *
   * @return {float} The total amount of the cryptocurrency security asset stored on the exchange.
   */
  return function(cryptocurrency: string) {
    const host = "https://gateway-web-markets.tzero.com"
    const loginEndpoint = "/auth/login"
    const loginUrl = host + loginEndpoint
    // console.log(loginUrl)

    const loginPayload = {
      "email": userEmail,
      "password": userPassword,
      "deviceFingerprint": userDeviceFingerprint
    }

    const loginParams: { [key: string]: string | boolean | object } = {
      "method": "POST",
      "muteHttpExceptions": true,
      "contentType": "application/json",
      "payload": JSON.stringify(loginPayload)
    }

    const loginResponse = UrlFetchApp.fetch(loginUrl, loginParams)
    // console.log(loginResponse)

    const loginResponseHeaders = loginResponse.getAllHeaders()
    // console.log(loginResponseHeaders)
    const loginResponseContent = loginResponse.getContentText()
    // console.log(loginResponseContent)
    const loginResponseJson = JSON.parse(loginResponseContent)
    // console.log(loginResponseJson)

    // noinspection JSUnresolvedVariable
    const brokerId = loginResponseJson.brokerId
    const accountId = loginResponseJson.accountId

    let loginCookie
    for (let k in loginResponseHeaders) {
      // console.log(k + ": " + loginResponseHeaders[k])
      if (k === "Set-Cookie") {
        // @ts-ignore
        for (let cookie of JSON.stringify(loginResponseHeaders[k]).split("")) {
          // console.log(cookie)
          if (cookie.includes("tzm-access")) {
            let cookiePieces = cookie.split("\",\"")
            loginCookie = cookiePieces[cookiePieces.length - 1]
          }
        }
      }
    }
    // console.log(loginCookie)

    const endpoint = "/wallets/balances/portfolios?accountId=" + accountId + "&brokerId=" + brokerId
    const url = host + endpoint
    // console.log(url)

    const params: { [key: string]: string | boolean | object } = {
      "method": "GET",
      "muteHttpExceptions": true,
      "headers": {
        "Content-Type": "application/json",
        "Cookie": loginCookie
      }
    }

    const response = UrlFetchApp.fetch(url, params)
    // console.log(response)
    const responseContent = response.getContentText()
    // console.log(responseContent)
    const responseJson = JSON.parse(responseContent)
    // console.log(responseJson)

    let total = 0
    if (responseJson.hasOwnProperty("tokenAssets")) {
      for (let token of responseJson.tokenAssets) {
        if (token.symbol.toLowerCase() === cryptocurrency.toLowerCase()) {
          // console.log(token)
          // noinspection JSUnresolvedVariable
          let balanceTotal = parseFloat(token.custodialBalance) +
            parseFloat(token.availableWithdrawalBalance) +
            parseFloat(token.openOrderBalance) +
            parseFloat(token.openDepositBalance)
          // @ts-ignore
          if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
            total += balanceTotal
          }
        }
      }
    }
    console.log(`Total ${cryptocurrency.toUpperCase()} on tZERO: ${total}`)
    return total
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches cryptocurrency balance from the CoinEx exchange.
 *
 * @param {string} apiKey - Personal CoinEx API key.
 * @param {string} apiSecret - Personal CoinEx API secret.
 *
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchCoinExBalance(apiKey: string, apiSecret: string) {
  /**
   * Fetches cryptocurrency balance from the CoinEx exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   *
   * @return {float} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency: string) {
    const host = "https://api.coinex.com"
    const api_version = "/v1"
    // const market_endpoint = "/market/ticker/all"
    const endpoint = "/balance/info"

    // noinspection TypeScriptValidateJSTypes
    const tonce = new Date().getTime().toLocaleString("fullwide", {useGrouping: false})

    // const url = host + api_version + market_endpoint
    // const response = UrlFetchApp.fetch(url)
    // const jsonObj = JSON.parse(response)
    // const tonce = jsonObj.data.date.toLocaleString("fullwide", {useGrouping: false})
    console.log(tonce)

    const url_params = "access_id=" + apiKey + "&tonce=" + tonce + "&secret_key=" + apiSecret
    console.log(url_params)
    const url = host + api_version + endpoint + "?" + url_params
    console.log(url)
    // @ts-ignore
    const signature = utilConvertByteStrToHexStr(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, url_params)).toUpperCase()
    console.log(signature)

    // throw new Error("stopping...")

    const params: { [key: string]: string | boolean | object } = {
      "method": "GET",
      "muteHttpExceptions": true,
      // "contentType": "application/json",
      "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1 WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36",
        "Content-Type": "application/json",
        "Authorization": signature
      }
    }

    const response = UrlFetchApp.fetch(url, params)
    // console.log(response)
    const responseContent = response.getContentText()
    console.log(responseContent)
    const responseJson = JSON.parse(responseContent)
    // console.log(JSON.stringify(responseJson, null, 2))

    let total = 0
    for (let balance of responseJson) {
      if (balance.currency.toLowerCase() === cryptocurrency.toLowerCase()) {
        let balanceTotal = parseFloat(balance.amount)
        // @ts-ignore
        if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
          total += balanceTotal
        }
      }
    }
    console.log(`Total ${cryptocurrency.toUpperCase()} on Gemini: ${total}`)
    return total
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches cryptocurrency balance from the MEXC Global exchange.
 *
 * @param {string} apiKey - Private MEXC API key.
 * @param {string} apiSecret - Private MEXC API secret.
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchMexcBalance(apiKey: string, apiSecret: string) {
  /**
   * Fetches cryptocurrency balance from the MEXC Global exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   * @return {float} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency: string) {
    const timestamp = Math.floor(Date.now() / 1000)
    console.log(timestamp.toPrecision())

    const requestParameters = ""
    const signatureStr = apiKey + timestamp + requestParameters
    console.log(signatureStr)

    // const signature = Utilities.computeHmacSha256Signature(signatureStr, apiSecret).map(
    //   function(e) {return ("0" + (e < 0 ? e + 256 : e).toString(16)).slice(-2)}
    // ).join("")
    // @ts-ignore
    const signature = utilConvertByteStrToHexStr(Utilities.computeHmacSha256Signature(signatureStr, apiSecret, Utilities.Charset.UTF_8))
    console.log(signature)

    const params: { [key: string]: string | boolean | object } = {
      "method": "get",
      "accept": "application/json",
      "muteHttpExceptions": true,
      "headers": {
        "ApiKey": apiKey,
        "Request-Time": timestamp,
        "Content-Type": "application/json",
        "Signature": signature
      }
    }
    // const url = "https://www.mexc.com/open/api/v2/common/timestamp"
    const url = "https://www.mexc.com/open/api/v2/account/info"
    // console.log(url)
    const response = UrlFetchApp.fetch(url, params)
    // console.log(response)
    const responseContent = response.getContentText()
    console.log(responseContent)
    const responseJson = JSON.parse(responseContent)
    // console.log(responseJson)

    // noinspection JSUnresolvedVariable
    const balances = responseJson.balances
    // console.log(balances)

    let total = 0
    for (let balance of balances) {
      if (balance.asset.toLowerCase() === cryptocurrency.toLowerCase()) {
        // console.log(balance)
        let balanceTotal = parseFloat(balance.free) + parseFloat(balance.locked)
        // @ts-ignore
        if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
          total += balanceTotal
        }
      }
    }
    console.log(`Total ${cryptocurrency.toUpperCase()} on Binance.US: ${total}`)
    return total
  }
}

export {CRYPTO_EXCHANGE_BALANCE, CRYPTO_EXCHANGES}
