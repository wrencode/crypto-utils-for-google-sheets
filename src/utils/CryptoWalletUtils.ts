// noinspection JSUnusedGlobalSymbols
/**
 * Parses multiple wallet addresses from comma-delimited string of addresses.
 *
 * @param {string} addresses - Comma-separated list of addresses as string from which to retrieve balances.
 *
 * @return {array} - An array of wallet addresses.
 */
function utilParseCryptoAddresses(addresses: string) {
  let addressArray = addresses.split(",")
  let addressIndex = 0
  for (let address of addressArray) {
    addressArray[addressIndex] = address.replace(/\s/g, '')
    addressIndex += 1
  }
  return addressArray
}

// noinspection JSUnusedGlobalSymbols
/**
 * Parses cryptocurrency wallet address and removes any hyphens and added actions assigned to it.
 *
 * @param {string} address - Cryptocurrency wallet address from which to remove action strings.
 *
 * @return {[key: string]: string | any} - Dictionary containing the cleaned address as well as a list of attached actions.
 */
function utilCleanAddress(address: string) {
  let addressArray = address.split("-")
  let addressInfo : { [key: string]: string | any } = {
    address: addressArray[0]
  }
  if (addressArray.length > 1) {
    addressInfo["actions"] = addressArray.slice(1)
  }
  // Logger.log(addressInfo)
  return addressInfo
}

// noinspection JSUnusedGlobalSymbols,JSValidateJSDoc
/**
 * Fetch the JSON response content from a given API.
 *
 * @param {string} url - URL for API call.
 * @param {string} [params=null] - Optional request parameters.
 *
 * @return {object} - The content of an API response formatted as a JSON object.
 */
function utilGetResponseJsonFromRequest(url: string, params: object = {"muteHttpExceptions": true}) {
  // console.log(url)
  // noinspection JSUnresolvedVariable
  const response = UrlFetchApp.fetch(url, params)
  // console.log(response)
  const responseContent = response.getContentText()
  // console.log(responseContent)
  // noinspection UnnecessaryLocalVariableJS
  const responseJson = JSON.parse(responseContent)
  // console.log(responseJson)
  return responseJson
}

// noinspection JSUnusedGlobalSymbols,JSValidateJSDoc
/**
 * Fetch the amount of a given cryptocurrency from an API call.
 *
 * @param {string} url - URL for API call.
 * @param {string} address - Public address for given cryptocurrency.
 * @param {string} parseJsonAttributes - String of JSON attributes necessary to parse the amount of the given cryptocurrency (format: "a.b.c").
 * @param {number} [parseAmountDenominator=undefined] - Denominator to calculate the correct number of decimal places for given cryptocurrency.
 * @param {string} [params=undefined] - Optional request parameters.
 *
 * @return {number} - Amount of given cryptocurrency parsed from the response JSON.
 */
function utilGetCryptoAmountFromApi(url: string, address: string, parseJsonAttributes: string, parseAmountDenominator: number | undefined = undefined, params: object | undefined = undefined) {

  let responseJson
  if (params != undefined) {
    responseJson = utilGetResponseJsonFromRequest(url, params)
  } else {
    responseJson = utilGetResponseJsonFromRequest(url)
  }

  let amount = 0
  try {
    const amountValue = String(parseJsonAttributes.split(".").reduce((obj, attribute) => {
      return obj[attribute];
    }, responseJson as {[key: string]: any}))
    // console.log(parseJsonAttributes)
    // console.log(amountValue)

    let parsedAmount
    if (parseAmountDenominator != undefined) {
      parsedAmount = parseFloat(amountValue) / parseAmountDenominator
    } else {
      parsedAmount = parseFloat(amountValue)
    }

    // let parsedAmount = parseFloat(amountValue) / parseAmountDenominator
    if (parsedAmount === undefined) {
      // noinspection ExceptionCaughtLocallyJS
      throw new Error("Unable to parse value.")
    } else {
      amount += parsedAmount
    }
  } catch(err) {
    console.log("ERROR: Failed to parse amount for address: " + address)
  }

  return Number(amount)
}

// noinspection JSUnusedGlobalSymbols,JSValidateJSDoc
/**
 * Check if an array exists and if it is not empty.
 *
 * @param {array} array - Array to check.
 *
 * @return {boolean} - Boolean representing if the array exists and is not empty.
 */
function utilCheckArrayExistsAndNotEmpty(array: Array<any>) {
  // noinspection JSDeprecatedSymbols
  return !(!Array.isArray(array) || !array.length);
}

// noinspection JSUnusedGlobalSymbols
/**
 * Pretty-print JSON in human-readable format.
 *
 * @param {any} jsonObj - JSON object to pretty-print.
 *
 * @return {string} - A JSON string that has been prettified to improve human-readability during printing.
 */
function utilPrettyPrintJson(jsonObj: any) {
  let prettifiedJsonStr = JSON.stringify(jsonObj, undefined, "2")
  Logger.log(prettifiedJsonStr)
  return prettifiedJsonStr
}

export {utilParseCryptoAddresses, utilCleanAddress, utilGetResponseJsonFromRequest, utilGetCryptoAmountFromApi, utilCheckArrayExistsAndNotEmpty, utilPrettyPrintJson}
