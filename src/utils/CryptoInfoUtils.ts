// noinspection JSUnusedGlobalSymbols,JSValidateJSDoc
/**
 * Check if a value is numerical.
 *
 * @param {any} value - Value for which to check if it is a number.
 *
 * @return {boolean} - Boolean representing if the given value is a number.
 */
function isNumber(value: number){
  return !isNaN(value)
}

export { isNumber }
