// noinspection JSUnusedGlobalSymbols,JSValidateJSDoc
/**
 * Retrieved value of cryptocurrency given a USD amount.
 *
 * @param {string} currencyOut - Selected currency for which to output a value.
 * @param {number} currencyOutValue - Value of the selected output cryptocurrency.
 * @param {string} apiKey - API key for cryptocompare.com.
 * @param {string} cryptocompareAppName - Selected cryptocurrency for which to retrieve the balance.
 * @param {boolean} doRefresh - Unused variable used to refresh function.
 *
 * @return {string} - Cryptocurrency amount.
 */
function utilGetCryptoValueFromUsd(currencyOut: string, currencyOutValue: number, apiKey: string, cryptocompareAppName: string, doRefresh = true) {

  const url = "https://min-api.cryptocompare.com/data/price?fsym=usd&tsyms=" + currencyOut + "&apiKey=" + apiKey + "&extraParams=" + cryptocompareAppName
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

export { utilGetCryptoValueFromUsd }
