// noinspection DuplicatedCode

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
    console.log(`Total ${cryptocurrency.toUpperCase()} on MEXC: ${total}`)
    return total
  }
}

export {fetchBittrexBalance, fetchTzeroBalance, fetchCoinExBalance, fetchMexcBalance}
