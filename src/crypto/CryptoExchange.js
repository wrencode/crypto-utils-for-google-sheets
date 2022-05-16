// import { utilParseExchanges, utilConvertByteStrToHexStr, utilHasSufficientValue } from "../utils/CryptoExchangeUtils.js"

/**
 * Retrieve cryptocurrency exchange balance(s) for chosen asset.
 *
 * @param {string} cryptocurrency - The ticker for the selected cryptocurrency.
 * @param {string} exchanges - The exchanges from which to retrieve balances.
 * @param {boolean} doRefresh - Unused variable used to refresh function.
 * @return {number} - The total amount of the cryptocurrency stored across all selected exchanges.
 * @customfunction
 */
function CRYPTO_EXCHANGE_BALANCE(cryptocurrency, exchanges, doRefresh = true) {

  let exchangesArray = utilParseExchanges(exchanges)
  Logger.log(exchangesArray)

  let exchangeFunctionMap = getCryptoExchangeBalanceFunctions()

  let randomDelay = Math.floor(Math.random() * 1000)
  Utilities.sleep(randomDelay)

  let totalAmount = 0.0
  if (Array.isArray(exchangesArray) && exchangesArray.length) {
    for (let exchange of exchangesArray) {
      let amount
      if (exchangeFunctionMap.hasOwnProperty(exchange.toLowerCase())) {
        amount = exchangeFunctionMap[exchange](cryptocurrency)
      } else {
        throw "Exchange " + exchange.toUpperCase() + " is not yet supported! " +
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
  Logger.log(`Total amount of ${cryptocurrency.toUpperCase()} on exchanges (${exchangesArray.join(", ")}): ${totalAmount.toPrecision()}`)
  return totalAmount
}

/**
 * All supported exchanges of CRYPTO_EXCHANGE_BALANCE.
 *
 * @return {array} - An array of all supported exchanges supported by CRYPTO_EXCHANGE_BALANCE.
 * @customfunction
 */
function CRYPTO_EXCHANGES(refresh = true) {
  let exchangesArray = Object.keys(getCryptoExchangeBalanceFunctions())
  Logger.log(exchangesArray)
  return exchangesArray.sort()
}

/**
 * Retrieve supported exchange function array for CRYPTO_EXCHANGE_BALANCE.
 *
 * @return {Object} - All exchanges supported by CRYPTO_EXCHANGE_BALANCE and their curried functions.
 */
function getCryptoExchangeBalanceFunctions() {

  const apis = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("apis")
    .getRange("A:D")
    .getValues()
  // Logger.log(apis)

  let apiDict = {}
  for (let api of apis) {
    if (api[0] !== '') {
      // Logger.log(api)
      apiDict[api[0]] = api.slice(1)
    }
  }
  // Logger.log(apiDict)

  return {
    "binance-us": fetchBinanceUsBalance(
      apiDict["binance-us"][0],
      apiDict["binance-us"][1]
    ),
    "kucoin": fetchKucoinBalance(
      apiDict["kucoin"][0],
      apiDict["kucoin"][1],
      apiDict["kucoin"][2],
    ),
    "kraken": fetchKrakenBalance(
      apiDict["kraken"][0],
      apiDict["kraken"][1]
    ),
    "bittrex": fetchBittrexBalance(
      apiDict["bittrex"][0],
      apiDict["bittrex"][1]
    ),
    "coinbase": fetchCoinbaseBalance(
      apiDict["coinbase"][0],
      apiDict["coinbase"][1]
    ),
    "coinbase-pro": fetchCoinbaseProBalance(
      apiDict["coinbase-pro"][0],
      apiDict["coinbase-pro"][1],
      apiDict["coinbase-pro"][2]
    ),
    "gemini": fetchGeminiBalance(
      apiDict["gemini"][0],
      apiDict["gemini"][1]
    ),
    "coinex": fetchCoinExBalance(
      apiDict["coinex"][0],
      apiDict["coinex"][1]
    ),
    "tzero": fetchTzeroBalance(
      apiDict["tzero"][0],
      apiDict["tzero"][2],
      apiDict["tzero"][1]
    ),
    "mexc": fetchMexcBalance(
      apiDict["mexc"][0],
      apiDict["mexc"][1]
    ),
  }
}

/**
 * Fetches cryptocurrency balance from the Binance exchange.
 *
 * @param {string} apiKey - Personal Binance API key.
 * @param {string} apiSecret - Personal Binance API secret.
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchBinanceUsBalance(apiKey, apiSecret) {
  /**
   * Fetches cryptocurrency balance from the Binance.US exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   * @return {number} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency) {
    let curTime = new Date().getTime()
    let timestamp = "timestamp=" + curTime

    let signature = Utilities.computeHmacSha256Signature(timestamp, apiSecret)
    signature = signature.map(function(e) {
      let v = (e < 0 ? e + 256 : e).toString(16)
      return v.length === 1 ? "0" + v : v
    }).join("")

    const params = {
      "method": "GET",
      "accept": "application/json",
      "headers": {"X-MBX-APIKEY": apiKey},
      "muteHttpExceptions": true
    }
    // make sure to use the binance.us API endpoint for Binance.us accounts
    let url = "https://api.binance.us/api/v3/account?" + timestamp + "&signature=" + signature
    // Logger.log(url)
    let response = UrlFetchApp.fetch(url, params)
    // Logger.log(response)
    let responseContent = response.getContentText()
    // Logger.log(responseContent)
    let responseJson = JSON.parse(responseContent)
    // Logger.log(responseJson)

    // noinspection JSUnresolvedVariable
    let balances = responseJson.balances
    // Logger.log(balances)

    let total = 0
    for (let balance of balances) {
      if (balance.asset.toLowerCase() === cryptocurrency.toLowerCase()) {
        // Logger.log(balance)
        let balanceTotal = parseFloat(balance.free) + parseFloat(balance.locked)
        if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
          total += balanceTotal
        }
      }
    }
    Logger.log(`Total ${cryptocurrency.toUpperCase()} on Binance.US: ${total}`)
    return total
  }
}

/**
 * Fetches cryptocurrency balance from the KuCoin exchange.
 *
 * @param {string} apiKey - Personal KuCoin API key.
 * @param {string} apiSecret - Personal KuCoin API secret.
 * @param {string} apiPassphrase - Personal KuCoin API passphrase.
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchKucoinBalance(apiKey, apiSecret, apiPassphrase) {
  /**
   * Fetches cryptocurrency balance from the KuCoin exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   * @return {float} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency) {
    //var host = 'https://api.kucoin.com'
    var host = "https://openapi-v2.kucoin.com"
    var endpoint = "/api/v1/accounts"

    var nonce = Date.now() + ""
    var stringToSign = nonce + "GET" + endpoint
    // Logger.log(stringToSign)

    var secret = Utilities.newBlob(apiSecret).getDataAsString()

    var signature = Utilities.computeHmacSha256Signature(stringToSign, secret)
    var signature = Utilities.base64Encode(signature)
    // Logger.log("Signature: " + signature)

    var passphrase = Utilities.computeHmacSha256Signature(apiPassphrase, secret, Utilities.Charset.UTF_8)
    var passphrase = Utilities.base64Encode(passphrase)
    // Logger.log("Passphrase: " + passphrase)

    var url = host + endpoint
    // Logger.log(url)
    var params = {
      "headers" : {
        "KC-API-SIGN": signature,
        "KC-API-TIMESTAMP": nonce,
        "KC-API-KEY": apiKey,
        "KC-API-PASSPHRASE": passphrase,
        "KC-API-KEY-VERSION": "2"
      },
      "muteHttpExceptions": true
    }

    var response = UrlFetchApp.fetch(url, params).getContentText()
    var jsonObj = JSON.parse(response)

    // Logger.log(jsonObj)

    var balances = jsonObj.data

    // Logger.log(balances)

    var total = 0
    for (let balance of balances) {
      if (balance.currency.toLowerCase() === cryptocurrency.toLowerCase()) {
        let balanceTotal = parseFloat(balance.balance)
        if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
          total += balanceTotal
        }
      }
    }
    Logger.log(`Total ${cryptocurrency.toUpperCase()} on KuCoin: ${total}`)
    return total
  }
}

/**
 * Fetches cryptocurrency balance from the Kraken exchange.
 *
 * @param {string} apiKey - Personal Kraken API key.
 * @param {string} apiSecret - Personal Kraken API secret.
 * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchKrakenBalance(apiKey, apiSecret) {
  /**
   * Fetches cryptocurrency balance from the Kraken exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   * @return {float} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency) {
    var host = "https://api.kraken.com"
    var endpoint = "/0/private/Balance"
    var url = host + endpoint
    // Logger.log(url)

    var nonce = new Date () * 1000
    var payload = "nonce=" + nonce + "&" + ""
    // Logger.log("Payload: " + payload)
    var encodedBody = Utilities.newBlob(endpoint).getBytes().concat(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, nonce + payload))
    // Logger.log("Encoded body: " + encodedBody)

    var signature = Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_512, encodedBody, Utilities.base64Decode(apiSecret))
    // Logger.log("Signature: " + signature)

    var params = {
      "method": "post",
      "payload": payload,
      "headers" : {
        "API-Key": apiKey,
        "API-Sign": Utilities.base64Encode(signature)
      },
      "muteHttpExceptions": true
    }

    var response = UrlFetchApp.fetch(url, params).getContentText()
    // Logger.log(response)
    var jsonObj = JSON.parse(response)
    // Logger.log(jsonObj)
    var balances = jsonObj.result
    // Logger.log(balances)

    var total = 0
    for (let [key, value] of Object.entries(balances)) {
      // For older listed cryptos, Kraken starts the ticker with "X", and for fiat currencies, starts it with "Z"
      // See: https://support.kraken.com/hc/en-us/articles/360001185506-How-to-interpret-asset-codes
      if (cryptocurrency.toLowerCase() === key.toLowerCase() || (cryptocurrency.toLowerCase() === key.slice(1).toLowerCase() && key.charAt(0) === "X")) {
        let balanceTotal = parseFloat(value)
        if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
          total += balanceTotal
        }
      }
    }
    Logger.log(`Total ${cryptocurrency.toUpperCase()} on Kraken: ${total}`)
    return total
  }
}

/**
 * Fetches cryptocurrency balance from the Bittrex exchange.
 * Code snippets taken from https://github.com/moosylog/exchange_collectors/blob/master/bittrex.gs
 *
 * @param {string} apiKey - Personal Bittrex API key.
 * @param {string} apiSecret - Personal Bittrex API secret.
 * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchBittrexBalance(apiKey, apiSecret) {
  /**
   * Fetches cryptocurrency balance from the Bittrex exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   * @return {float} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency) {
    var host = "https://api.bittrex.com/v3"
    var endpoint = "/balances/" + cryptocurrency
    var url = host + endpoint
    // Logger.log(url)

    var nonce = new Date().getTime().toString()
    var payload = ""
    var contentHash = utilConvertByteStrToHexStr(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_512, payload)).toString()
    var signature = utilConvertByteStrToHexStr(Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_512, nonce + host + endpoint + "GET" + contentHash, apiSecret)).toString()

    var params = {
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

    var response = UrlFetchApp.fetch(url, params).getContentText()
    // Logger.log(response)
    var jsonObj = JSON.parse(response)
    // Logger.log(jsonObj)
    var total = parseFloat(jsonObj.total)

    if (!utilHasSufficientValue(cryptocurrency, total)) {
      total = 0
    }

    Logger.log(`Total ${cryptocurrency.toUpperCase()} on Bittrex: ${total}`)
    return total
  }
}

/**
 * Fetches cryptocurrency balance from the Coinbase exchange.
 * Code snippets taken from https://github.com/moosylog/exchange_collectors/blob/master/coinbase.gs
 *
 * @param {string} apiKey - Personal Coinbase API key.
 * @param {string} apiSecret - Personal Coinbase API secret.
 * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchCoinbaseBalance(apiKey, apiSecret) {
  /**
   * Fetches cryptocurrency balance from the Coinbase exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   * @return {float} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency) {
    var host = "https://api.coinbase.com"
    var endpoint = "/v2/accounts"
    var url = host + endpoint
    // Logger.log(url)

    var nonce = Math.floor((new Date().getTime()/1000)).toString()
    var payload = nonce + "GET" + endpoint + ""
    var signature = utilConvertByteStrToHexStr(Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_256, payload, apiSecret)).toString()
    var params = {
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

    var response = UrlFetchApp.fetch(url, params).getContentText()
    // Logger.log(response)
    var jsonObj = JSON.parse(response)
    Logger.log(jsonObj)
    var balances = jsonObj.data
    // Logger.log(balances)

    var total = 0
    for (let balance of balances) {
      if (balance.balance.currency.toLowerCase() === cryptocurrency.toLowerCase()) {
        let balanceTotal = parseFloat(balance.balance.amount)
        if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
          total += balanceTotal
        }
      }
    }
    Logger.log(`Total ${cryptocurrency.toUpperCase()} on Coinbase: ${total}`)

    // var endpoint = "https://www.coinbase.com/graphql/query?&operationName=rewardsQuery&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%2255e68bb3ecebdbd4391ee8c51071c2ad8aef85d97448abd8851fbf5110c2a834%22%7D%7D&variables=%7B%22skip%22%3Afalse%2C%22nativeCurrency%22%3A%22USD%22%7D"
    // var url = host + endpoint

    return total
  }
}

/**
 * Fetches cryptocurrency balance from the Coinbase Pro exchange.
 *
 * @param {string} apiKey - Personal Coinbase Pro API key.
 * @param {string} apiSecret - Personal Coinbase Pro API secret.
 * @param {string} apiPassphrase - Personal Coinbase Pro API passphrase.
 * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchCoinbaseProBalance(apiKey, apiSecret, apiPassphrase) {
  /**
   * Fetches cryptocurrency balance from the Coinbase Pro exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   * @return {float} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency) {
    var host = "https://api.pro.coinbase.com"
    var endpoint = "/accounts"
    var url = host + endpoint
    // Logger.log(url)

    var nonce = Math.floor((new Date().getTime()/1000)).toString()
    var signature = Utilities.base64Encode(Utilities.computeHmacSha256Signature(Utilities.base64Decode(Utilities.base64Encode(nonce + "GET" + endpoint + "")), Utilities.base64Decode(apiSecret)))

    var params = {
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

    var response = UrlFetchApp.fetch(url, params).getContentText()
    // Logger.log(response)
    var jsonObj = JSON.parse(response)
    // Logger.log(JSON.stringify(jsonObj, null, 2))

    var total = 0
    for (let balance of jsonObj) {
      if (balance.currency.toLowerCase() === cryptocurrency.toLowerCase()) {
        let balanceTotal = parseFloat(balance.balance)
        if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
          total += balanceTotal
        }
      }
    }
    Logger.log(`Total ${cryptocurrency.toUpperCase()} on Coinbase Pro: ${total}`)
    return total
  }
}

/**
 * Fetches cryptocurrency balance from the Gemini exchange.
 * Code snippets taken from https://github.com/moosylog/exchange_collectors/blob/master/gemini.gs
 *
 * @param {string} apiKey - Personal Gemini API key.
 * @param {string} apiSecret - Personal Gemini API secret.
 * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchGeminiBalance(apiKey, apiSecret) {
  /**
   * Fetches cryptocurrency balance from the Gemini exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   * @return {float} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency) {
    var host = "https://api.gemini.com"
    var endpoint = "/v1/balances"
    var url = host + endpoint
    // Logger.log(url)

    var nonce = new Date().getTime()
    var payload = {"request": endpoint, "nonce": nonce}
    var signature = utilConvertByteStrToHexStr(Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_384, Utilities.base64Encode(JSON.stringify(payload)), apiSecret)).toString()

    var params = {
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

    var response = UrlFetchApp.fetch(url, params).getContentText()
    // Logger.log(response)
    var jsonObj = JSON.parse(response)
    // Logger.log(JSON.stringify(jsonObj, null, 2))

    var total = 0
    for (let balance of jsonObj) {
      if (balance.currency.toLowerCase() === cryptocurrency.toLowerCase()) {
        let balanceTotal = parseFloat(balance.amount)
        if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
          total += balanceTotal
        }
      }
    }
    Logger.log(`Total ${cryptocurrency.toUpperCase()} on Gemini: ${total}`)
    return total
  }
}

/**
 * Fetches cryptocurrency balance from the CoinEx exchange.
 *
 * @param {string} apiKey - Personal CoinEx API key.
 * @param {string} apiSecret - Personal CoinEx API secret.
 * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchCoinExBalance(apiKey, apiSecret) {
  /**
   * Fetches cryptocurrency balance from the CoinEx exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   * @return {float} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency) {
    var host = "https://api.coinex.com"
    var api_version = "/v1"
    var market_endpoint = "/market/ticker/all"
    var endpoint = "/balance/info"

    var tonce = new Date().getTime().toLocaleString("fullwide", {useGrouping: false})

    // var url = host + api_version + market_endpoint
    // var response = UrlFetchApp.fetch(url)
    // var jsonObj = JSON.parse(response)
    // var tonce = jsonObj.data.date.toLocaleString("fullwide", {useGrouping: false})
    Logger.log(tonce)

    var url_params = "access_id=" + apiKey + "&tonce=" + tonce + "&secret_key=" + apiSecret
    Logger.log(url_params)
    var url = host + api_version + endpoint + "?" + url_params
    Logger.log(url)
    var signature = utilConvertByteStrToHexStr(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, url_params)).toUpperCase()
    Logger.log(signature)

    // throw new Error("stopping...")

    var params = {
      "method": "GET",
      "muteHttpExceptions": true,
      // "contentType": "application/json",
      "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1 WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36",
        "Content-Type": "application/json",
        "Authorization": signature
      }
    }

    var response = UrlFetchApp.fetch(url, params).getContentText()
    Logger.log(response)
    var jsonObj = JSON.parse(response)
    // Logger.log(JSON.stringify(jsonObj, null, 2))

    var total = 0
    for (let balance of jsonObj) {
      if (balance.currency.toLowerCase() === cryptocurrency.toLowerCase()) {
        let balanceTotal = parseFloat(balance.amount)
        if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
          total += balanceTotal
        }
      }
    }
    Logger.log(`Total ${cryptocurrency.toUpperCase()} on Gemini: ${total}`)
    return total
  }
}

/**
 * Fetches cryptocurrency security asset balance from the tZERO exchange.
 *
 * @param {string} userEmail - tZERO user email.
 * @param {string} userPassword - tZERO user password.
 * @param {string} userDeviceFingerprint - tZERO unique device fingerprint.
 * @param {string} cryptocurrency - Selected cryptocurrency security asset for which to retrieve the balance.
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency security asset stored on the exchange.
 */
function fetchTzeroBalance(userEmail, userPassword, userDeviceFingerprint) {
  /**
   * Fetches cryptocurrency security asset balance from the tZERO exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency security asset for which to retrieve the balance.
   * @return {float} The total amount of the cryptocurrency security asset stored on the exchange.
   */
  return function(cryptocurrency) {
    var host = "https://gateway-web-markets.tzero.com"
    var loginEndpoint = "/auth/login"
    var loginUrl = host + loginEndpoint
    // Logger.log(loginUrl)

    var payload = {
      "email": userEmail,
      "password": userPassword,
      "deviceFingerprint": userDeviceFingerprint
    }

    var params = {
      "method": "POST",
      "muteHttpExceptions": true,
      "contentType": "application/json",
      "payload": JSON.stringify(payload)
    }

    var loginResponse = UrlFetchApp.fetch(loginUrl, params)
    // Logger.log(loginResponse)

    var loginResponseHeaders = loginResponse.getAllHeaders()
    // Logger.log(logingResponseHeaders)
    var loginResponseContent = loginResponse.getContentText()
    // Logger.log(loginResponseContent)
    var jsonObj = JSON.parse(loginResponseContent)
    // Logger.log(jsonObj)

    var brokerId = jsonObj.brokerId
    var accountId = jsonObj.accountId

    var loginCookie
    for (let k in loginResponseHeaders) {
      // Logger.log(k + ": " + loginResponseHeaders[k])
      if (k === "Set-Cookie") {
        for (let cookie of JSON.stringify(loginResponseHeaders[k]).split("")) {
          // Logger.log(cookie)
          if (cookie.includes("tzm-access")) {
            let cookiePieces = cookie.split("\",\"")
            loginCookie = cookiePieces[cookiePieces.length - 1]
          }
        }
      }
    }
    // Logger.log(loginCookie)

    var endpoint = "/wallets/balances/portfolios?accountId=" + accountId + "&brokerId=" + brokerId
    var url = host + endpoint
    // Logger.log(url)

    var params = {
      "method": "GET",
      "muteHttpExceptions": true,
      "headers": {
        "Content-Type": "application/json",
        "Cookie": loginCookie
      }
    }

    var response = UrlFetchApp.fetch(url, params).getContentText()
    // Logger.log(response)
    var jsonObj = JSON.parse(response)
    // Logger.log(jsonObj)

    var total = 0
    if (jsonObj.hasOwnProperty("tokenAssets")) {
      for (let token of jsonObj.tokenAssets) {
        if (token.symbol.toLowerCase() === cryptocurrency.toLowerCase()) {
          // Logger.log(token)
          let balanceTotal = parseFloat(parseFloat(token.custodialBalance) +
            parseFloat(token.availableWithdrawalBalance) +
            parseFloat(token.openOrderBalance) +
            parseFloat(token.openDepositBalance))
          if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
            total += balanceTotal
          }
        }
      }
    }
    Logger.log(`Total ${cryptocurrency.toUpperCase()} on tZERO: ${total}`)
    return total
  }
}

/**
 * Fetches cryptocurrency balance from the MEXC Global exchange.
 *
 * @param {string} apiKey - Private MEXC API key.
 * @param {string} apiSecret - Private MEXC API secret.
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored on the exchange.
 */
function fetchMexcBalance(apiKey, apiSecret) {
  /**
   * Fetches cryptocurrency balance from the MEXC Global exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   * @return {float} The total amount of the cryptocurrency stored on the exchange.
   */
  return function(cryptocurrency) {
    var timestamp = Math.floor(Date.now() / 1000)
    Logger.log(timestamp.toPrecision())

    var requestParameters = ""
    var signatureStr = apiKey + timestamp + requestParameters
    Logger.log(signatureStr)

    // var signature = Utilities.computeHmacSha256Signature(signatureStr, apiSecret).map(
    //   function(e) {return ("0" + (e < 0 ? e + 256 : e).toString(16)).slice(-2)}
    // ).join("")
    var signature = utilConvertByteStrToHexStr(Utilities.computeHmacSha256Signature(signatureStr, apiSecret, Utilities.Charset.UTF_8))
    Logger.log(signature)

    var params = {
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
    var url = "https://www.mexc.com/open/api/v2/account/info"
    var response = UrlFetchApp.fetch(url, params).getContentText()
    // var url = "https://www.mexc.com/open/api/v2/common/timestamp"
    // var response = UrlFetchApp.fetch(url).getContentText()
    Logger.log(response)
    var jsonObj = JSON.parse(response)
    // Logger.log(jsonObj)

    var balances = jsonObj.balances
    // Logger.log(balances)

    var total = 0
    for (let balance of balances) {
      if (balance.asset.toLowerCase() === cryptocurrency.toLowerCase()) {
        // Logger.log(balance)
        let balanceTotal = parseFloat(balance.free) + parseFloat(balance.locked)
        if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
          total += balanceTotal
        }
      }
    }
    Logger.log(`Total ${cryptocurrency.toUpperCase()} on Binance.US: ${total}`)
    return total
  }
}

// export {CRYPTO_EXCHANGE_BALANCE, CRYPTO_EXCHANGES}
