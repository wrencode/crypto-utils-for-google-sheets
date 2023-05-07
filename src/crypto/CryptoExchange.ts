// noinspection DuplicatedCode

// import { utilParseExchanges, utilConvertByteStrToHexStr, utilHasSufficientValue } from "../utils/CryptoExchangeUtils"

// noinspection JSUnusedGlobalSymbols,JSValidateJSDoc
/**
 * Retrieve all supported exchanges of the CRYPTO_EXCHANGE_BALANCE custom function.
 *
 * @param {string} exchangesApiCredentials - Comma-separated list of exchange API credentials as string, formatted as name:key:secret or name:key:secret:passphrase (Ex.: "name:key:secret,name:key:secret:passphrase").
 * @param {boolean} doRefresh - Variable used to refresh function (can be any value that changes).
 *
 * @return {array} - An array of all exchanges supported by the CRYPTO_EXCHANGE_BALANCE custom function.
 *
 * @customfunction
 */
function CRYPTO_EXCHANGES(exchangesApiCredentials: string, doRefresh = true) {
  let exchangesArray = Object.keys(getCryptoExchangeBalanceFunctions(exchangesApiCredentials))
  console.log(exchangesArray)
  return exchangesArray.sort()
}

// noinspection JSValidateJSDoc,JSUnusedGlobalSymbols
/**
 * Retrieve cryptocurrency exchange balance(s) of the selected cryptocurrency asset.
 *
 * @param {string} cryptocurrencyTicker - Ticker of the selected cryptocurrency for which to retrieve exchange balance(s).
 * @param {string} exchanges - Comma-separated list of exchanges as string (Ex.: "coinbase,binance-us").
 * @param {string} exchangesApiCredentials - Comma-separated list of exchange API credentials as string, formatted as name:key:secret or name:key:secret:passphrase (Ex.: "name:key:secret,name:key:secret:passphrase").
 * @param {boolean} doRefresh - Variable used to refresh function (can be any value that changes).
 *
 * @return {number} - The total amount (sum of exchange balance(s)) of the selected cryptocurrency stored across selected exchanges.
 *
 * @customfunction
 */
function CRYPTO_EXCHANGE_BALANCE(cryptocurrencyTicker: string, exchanges: string, exchangesApiCredentials: string, doRefresh = true) {

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
        amount = exchangeFunctionMap[exchange](cryptocurrencyTicker)
      } else {
        throw "Exchange " + exchange.toUpperCase() + " is not yet supported or you have not supplied an API key & secret for it! " +
        "Call CRYPTO_EXCHANGES to get an array of currently supported exchanges."
      }
      if (!isNaN(amount)){
        totalAmount += amount
      } else {
        throw "Retrieval of cryptocurrency " + cryptocurrencyTicker + " failed. " +
        "It is possible that there was a problem with an exchange API used to retrieve balances of this asset."
      }
    }
  }
  console.log(`Total amount of ${cryptocurrencyTicker.toUpperCase()} on exchanges (${exchangesArray.join(", ")}): ${totalAmount.toPrecision()}`)
  return totalAmount
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
    apiKey: string
    apiSecret: string
    apiPass: string | null
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

  const cryptoExchangeBalanceFunctionMap: { [key: string]: Function } = {
    "binance-us": fetchBinanceUsBalance,
    "kucoin": fetchKucoinBalance,
    "kraken": fetchKrakenBalance,
    "coinbase": fetchCoinbaseBalance,
    "gemini": fetchGeminiBalance
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
   * Fetches cryptocurrency balance (including staked balance) from the Binance.US exchange.
   *
   * @param {string} cryptocurrency - Selected cryptocurrency for which to retrieve the balance.
   * @return {number} The total amount of the cryptocurrency stored on the exchange.
   */
  return function (cryptocurrency: string) {
    const host = "https://api.binance.us"

    let curTime = new Date().getTime()
    let timestampStr = "timestamp=" + curTime
    let signature = Utilities.computeHmacSha256Signature(timestampStr, apiSecret)
    let signatureStr = "signature=" + signature.map(function (e) {
      let v = (e < 0 ? e + 256 : e).toString(16)
      return v.length === 1 ? "0" + v : v
    }).join("")
    // console.log("Signature: " + signatureStr)

    const accountsParams: { [key: string]: string | boolean | object } = {
      "method": "GET",
      "accept": "application/json",
      "headers": {
        "X-MBX-APIKEY": apiKey
      },
      "muteHttpExceptions": true
    }
    // make sure to use the binance.us API endpoint for Binance.us accounts
    let accountsUrl = host + "/api/v3/account?" + timestampStr + "&" + signatureStr
    // console.log(accountsUrl)
    let response = UrlFetchApp.fetch(accountsUrl, accountsParams)
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
      const asset = balance.asset.toLowerCase()
      if (asset === cryptocurrency.toLowerCase()) {
        // console.log(balance)
        let balanceTotal = parseFloat(balance.free) + parseFloat(balance.locked)

        let stakingCurTime = new Date().getTime()
        let stakingAssetStr = "asset=" + asset
        let stakingTimestampStr = "timestamp=" + stakingCurTime
        let stakingSignature = Utilities.computeHmacSha256Signature(stakingAssetStr + "&" + stakingTimestampStr, apiSecret)
        let stakingSignatureStr = "signature=" + stakingSignature.map(function (e) {
          let v = (e < 0 ? e + 256 : e).toString(16)
          return v.length === 1 ? "0" + v : v
        }).join("")
        // console.log("Staking Signature: " + stakingSignatureStr)

        const stakingParams: { [key: string]: string | boolean | object } = {
          "method": "GET",
          "accept": "application/json",
          "headers": { "X-MBX-APIKEY": apiKey },
          "muteHttpExceptions": true
        }
        // make sure to use the binance.us API endpoint for Binance.us accounts
        let stakingUrl = host + "/sapi/v1/staking/stakingBalance?" + stakingAssetStr + "&" + stakingTimestampStr + "&" + stakingSignatureStr
        // console.log(stakingUrl)
        let stakingResponse = UrlFetchApp.fetch(stakingUrl, stakingParams)
        // console.log(stakingResponse)
        let stakingResponseContent = stakingResponse.getContentText()
        // console.log(stakingResponseContent)
        let stakingResponseJson = JSON.parse(stakingResponseContent)
        // console.log(stakingResponseJson)

        for (let stakingAsset of stakingResponseJson.data) {
          if (stakingAsset.asset.toLowerCase() === cryptocurrency.toLowerCase()) {
            let stakingAssetTotal = parseFloat(stakingAsset.stakingAmount) + parseFloat(stakingAsset.pendingRewards)
            // console.log(`Total ${cryptocurrency.toUpperCase()} staking on Binance.US: ${stakingAssetTotal}`)
            balanceTotal += stakingAssetTotal
          }
        }

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
    // const host = 'https://api.kucoin.com'
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
    const limit = 250
    const requestPath = "/api/v3/brokerage/accounts"
    const requestPathVars = `?limit=${limit}`
    const url = host + requestPath + requestPathVars
    // console.log(url)

    const nonce = Math.floor((new Date().getTime() / 1000)).toString()
    const payload = nonce + "GET" + requestPath + ""
    // @ts-ignore
    const signature = utilConvertByteStrToHexStr(Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_256, payload, apiSecret)).toString()
    const params: { [key: string]: string | boolean | object } = {
      "method": "GET",
      "muteHttpExceptions": true,
      "headers": {
        "Content-Type": "application/json",
        "CB-ACCESS-TIMESTAMP": nonce,
        "CB-ACCESS-SIGN": signature,
        "CB-ACCESS-KEY": apiKey,
      }
    }

    const response = UrlFetchApp.fetch(url, params)
    // console.log(response)
    const responseContent = response.getContentText()
    // console.log(responseContent)
    const responseJson = JSON.parse(responseContent)
    // console.log(responseJson)
    // for (let [key, value] of Object.entries(responseJson)) {
    //   if (key !== "accounts") {
    //     console.log(`${key}: ${value}`)
    //   }
    // }
    // TODO: handle repeated pagination instead of just using the max limit of 250
    // console.log(responseJson.has_next)
    const balances = responseJson.accounts
    // console.log(balances)

    let total = 0
    for (let balance of balances) {
      // noinspection JSUnresolvedVariable
      if (balance.currency.toLowerCase() === cryptocurrency.toLowerCase()) {
        // noinspection JSUnresolvedVariable
        let balanceTotal = parseFloat(balance.available_balance.value)
        // @ts-ignore
        if (utilHasSufficientValue(cryptocurrency, balanceTotal)) {
          total += balanceTotal
        }
      }
    }
    console.log(`Total ${cryptocurrency.toUpperCase()} on Coinbase: ${total}`)
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

export {CRYPTO_EXCHANGES, CRYPTO_EXCHANGE_BALANCE}
