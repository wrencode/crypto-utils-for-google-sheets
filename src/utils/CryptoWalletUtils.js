/**
 * Parses multiple wallet addresses from comma-delimited string of addresses.
 *
 * @return {array} - An array of wallet addresses.
 */
function utilParseCryptoAddresses(addresses) {
  let addressArray = addresses.split(",")
  let addressIndex = 0
  for (let address of addressArray) {
    addressArray[addressIndex] = address.replace(/\s/g, '')
    addressIndex += 1
  }
  return addressArray
}

function utilCleanAddress(address) {
  let addressArray = address.split("-")
  let addressInfo = {
    address: addressArray[0]
  }
  if (addressArray.length > 1) {
    addressInfo["actions"] = addressArray.slice(1)
  }
  // Logger.log(addressInfo)

  return addressInfo
}

function utilCheckArrayExistsAndNotEmpty(array) {
  return !(!Array.isArray(array) || !array.length);
}

function utilPrettyPrintJson(jsonObj) {
  Logger.log(JSON.stringify(jsonObj, null, 2))
}

// export {utilParseCryptoAddresses, utilCleanAddress, utilCheckArrayExistsAndNotEmpty, utilPrettyPrintJson}
