/**
 * Retrieved value of cryptocurrency given a USD amount.
 *
 * @return {string} - Cryptocurrency amount.
 */
function utilGetCryptoValueFromUsd(currencyOut, currencyOutValue, apiKey, cryptocompare_app_name, refresh) {

  const url = "https://min-api.cryptocompare.com/data/price?fsym=usd&tsyms=" + currencyOut + "&apiKey=" + apiKey + "&extraParams=" + cryptocompare_app_name
  // Logger.log(url)
  const response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true})
  // Logger.log(response)
  const responseContent = response.getContentText()
  // Logger.log(responseContent)
  const responseJson = JSON.parse(responseContent)
  // Logger.log(responseJson)

  currencyOutValue = Number(responseJson[currencyOut.toUpperCase()] * currencyOutValue)
  Logger.log(currencyOutValue)
  return currencyOutValue
}

// export { utilGetCryptoValueFromUsd }
