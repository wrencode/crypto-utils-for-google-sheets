// noinspection DuplicatedCode

// import {utilParseCryptoAddresses, utilCleanAddress, utilGetResponseJsonFromRequest, utilGetCryptoAmountFromApi} from "../utils/CryptoWalletUtils"

// noinspection JSValidateJSDoc,JSUnusedGlobalSymbols
/**
 * All supported cryptocurrencies of CRYPTO_WALLET_BALANCE.
 *
 * @param {boolean} doRefresh - Unused variable used to refresh function.
 *
 * @return {array} - An array of all supported cryptocurrency tickers supported by CRYPTO_WALLET_BALANCE.
 *
 * @customfunction
 */
function CRYPTO_WALLET_TICKERS(doRefresh = true) {
  let tickerArray = Object.keys(getCryptoWalletAssets())
  console.log(tickerArray)
  return tickerArray.sort()
}

// noinspection JSValidateJSDoc,JSUnusedGlobalSymbols
/**
 * Retrieve cryptocurrency wallet balance(s) for chosen asset.
 *
 * @param {string} cryptocurrency - The ticker for the selected cryptocurrency.
 * @param {string} walletAddresses - Comma-separated list of public wallet addresses as string.
 * @param {string} apiKey - Personal etherscan.io API key for use with ETH and ERC20 assets.
 * @param {boolean} doRefresh - Unused variable used to refresh function.
 *
 * @return {float} - The total amount of the cryptocurrency stored in the wallet.
 *
 * @customfunction
 */
function CRYPTO_WALLET_BALANCE(cryptocurrency: string, walletAddresses: string, apiKey: string, doRefresh = true) {

  // @ts-ignore
  walletAddresses = utilParseCryptoAddresses(walletAddresses).filter(Boolean)
  console.log(walletAddresses)

  const cryptoAssets = getCryptoWalletAssets() as {[key: string]: Array<Function>}

  cryptocurrency = cryptocurrency.toUpperCase()
  const randomDelay = Math.floor(Math.random() * 1000)
  Utilities.sleep(randomDelay)

  let amount
  if (cryptoAssets.hasOwnProperty(cryptocurrency)) {
    // amount = cryptoAssets[cryptocurrency](walletAddresses, apiKey)
    amount = cryptoAssets[cryptocurrency].reduce((prevFunc, currFunc) => {
      return () => {
        return prevFunc(walletAddresses, apiKey) + currFunc(walletAddresses, apiKey)
      }
    }, () => 0)()

    console.log(`Total amount of ${cryptocurrency.toUpperCase()}: ${amount.toPrecision()}`)
  } else {
    throw "Cryptocurrency " + cryptocurrency + " is not yet supported! " +
    "Call CRYPTO_WALLET_TICKERS to get an array of currently supported cryptocurrencies. " +
    "Please contact dev@wrencode.com to request support for additional crypto assets."
  }

  if (!isNaN(amount)){
    return amount
  } else {
    // RETURN for testing only
    // return amount
    throw "Retrieval of cryptocurrency " + cryptocurrency + " failed. " +
    "It is possible that there was a problem with the API used for this asset. " +
    "Please contact dev@wrencode.com to report this issue."
  }
}

// noinspection JSValidateJSDoc
/**
 * Retrieve supported cryptocurrency function array for CRYPTO_WALLET_BALANCE.
 *
 * @return {object} - All assets supported by CRYPTO_WALLET_BALANCE and their curried functions.
 */
function getCryptoWalletAssets() {
  return {
    "ETH": [fetchEthereumBalance],
    "OMG": [fetchEthereumPlatformBalance("0xd26114cd6EE289AccF82350c8d8487fedB8A0C07", 1000000000000000000)],
    "KCS": [fetchEthereumPlatformBalance("0xf34960d9d60be18cC1D5Afc1A6F012A723a28811", 1000000)],
    "POLY": [fetchEthereumPlatformBalance("0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec", 1000000000000000000)],
    "POE": [fetchEthereumPlatformBalance("0x0e0989b1f9b8a38983c2ba8053269ca62ec9b195", 100000000)],
    "USDC": [fetchEthereumPlatformBalance("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", 1000000)],
    "USDT": [fetchEthereumPlatformBalance("0xdac17f958d2ee523a2206206994597c13d831ec7", 1000000)],
    "TZROP": [fetchEthereumPlatformBalance("0x5bd5B4e1a2c9B12812795E7217201B78C8C10b78", 1)],
    "MATIC": [
      fetchEthereumPlatformBalance("0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0", 1000000000000000000),
      fetchEthereumPlatformStakingBalance("0xafe97c48b465d424d25ae3a52a722f4496ceb6e3", 1000000000000000000)
    ],
    "NEO": [fetchNeoPlatformBalance("c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b")],
    "GAS": [fetchNeoPlatformBalance("602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7")],
    "DBC": [fetchNeoPlatformBalance("b951ecbbc5fe37a9c280a76cb0ce0014827294cf")],
    "TKY": [fetchNeoPlatformBalance("132947096727c84c7f9e076c90f08fec3bc17f18")],
    "ONT": [fetchNeoPlatformBalance("ceab719b8baa2310f232ee0d277c061704541cfb")],
    "MCT": [fetchNeoPlatformBalance("a87cc2a513f5d8b4a42432343687c2127c60bc3f")],
    "IOTA": [fetchIotaBalance],
    "ARK": [fetchArkBalance],
    "NANO": [fetchNanoBalance],
    "BAN": [fetchBananoBalance],
    "BTC": [fetchBitcoinBalance],
    "XMR": [fetchMoneroBalance],
    "BNB": [fetchBinanceCoinBalance],
    "ALGO": [
      fetchAlgorandBalance,
      fetchAlgorandPlatformYieldlyLotteryStakingBalance("233725844", 1000000, "algorand"),
      fetchAlgorandPlatformYieldlyPoolStakingBalance(["233725850"], 1000000, "algorand"),
    ],
    "EXIT": [fetchAlgorandPlatformBalance("213345970", 100000000)],
    "YLDY": [
      fetchAlgorandPlatformBalance("226701642", 1000000),
      fetchAlgorandPlatformYieldlyLotteryStakingBalance("233725844", 1000000, "226701642"),
      fetchAlgorandPlatformYieldlyPoolStakingBalance(["233725850"], 1000000, "226701642"),
    ],
    "DEFLY": [
      fetchAlgorandPlatformBalance("470842789", 1000000),
      fetchAlgorandPlatformAlgoFiStakingBalance(["641499935"], 1000000, "470842789")
    ],
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of public ETH wallet(s).
 *
 * @param {string} addresses - Comma-separated list of public wallet addresses as string.
 * @param {string} apiKey - Personal etherscan.io API key.
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchEthereumBalance(addresses: string, apiKey: string) {
  let totalAmount = 0
  for (let address of addresses) {
    // @ts-ignore
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    const url = "https://api.etherscan.io/api?module=account&action=balance&address=" + address + "&tag=latest&apikey=" + apiKey
    // console.log(url)
    // const response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true})
    // // console.log(response)
    // const responseContent = response.getContentText()
    // // console.log(responseContent)
    // const responseJson = JSON.parse(responseContent)
    // // console.log(responseJson)

    // @ts-ignore
    let amount = utilGetCryptoAmountFromApi(url, address, "result", 1000000000000000000)

    // let amount = parseFloat(responseJson.result) / 1000000000000000000

    console.log("Amount: " + amount)
    totalAmount += amount
  }
  return totalAmount
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of public ERC20 wallet(s).
 *
 * @param {string} contractAddress - The Ethereum platform asset contract address.
 * @param {number} denominator - Integer with number of zeros assigned to ERC20 token to display the readable amount.
 *
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored in the wallet(s) when passed the wallet address(es) and API key.
 */
function fetchEthereumPlatformBalance(contractAddress: string, denominator: number) {
  /**
   * Fetches balance(s) of public ERC20 wallet(s).
   *
   * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
   * @param {string} apiKey - Personal etherscan.io API key.
   *
   * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
   */
  return function(addresses: string, apiKey: string) {
    let totalAmount = 0
    for (let address of addresses) {
      // @ts-ignore
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      const url = "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress="+ contractAddress + "&address="+ address + "&tag=latest&apikey=" + apiKey
      // // console.log(url)
      // const response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true})
      // // console.log(response)
      // const responseContent = response.getContentText()
      // // console.log(responseContent)

      // @ts-ignore
      let amount = utilGetCryptoAmountFromApi(url, address, "result", denominator)

      // let responseJson = {}
      // let amount = 0
      // try {
      //   responseJson = JSON.parse(responseContent)
      //   // console.log(responseJson)
      //
      //   let parsedAmount = parseFloat(responseJson.result) / denominator
      //   if (parsedAmount === undefined) {
      //     throw new Error("Unable to parse value.")
      //   } else {
      //     amount += parsedAmount
      //   }
      // } catch(err) {
      //   console.log("ERROR: Failed to parse amount for address: " + address)
      // }

      console.log("Amount: " + amount)
      totalAmount += amount
    }
    return totalAmount
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of staked ERC20 tokens.
 *
 * @param {string} contractAddress - The Ethereum platform asset contract address.
 * @param {number} denominator - Integer with number of zeros assigned to ERC20 token to display the readable amount.
 *
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored in the wallet(s) and staking contract.
 *
 */
function fetchEthereumPlatformStakingBalance(contractAddress: string, denominator: number) {
  /**
   * Fetches balance(s) of stakeable ERC20 tokens from both public wallet address(es) and staking contracts.
   *
   * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
   * @param {string} apiKey - Personal etherscan.io API key.
   *
   * @return {number} The total amount of the cryptocurrency stored in the wallet(s) and/or staking contract.
   */
  return function(addresses: string, apiKey: string) {
    let totalAmount = 0
    let validatorCount = 0
    for (let address of addresses) {
      // @ts-ignore
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      if ("actions" in addressInfo && addressInfo["actions"].includes("staking")) {
        const url = "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress="+ contractAddress + "&address="+ address + "&tag=latest&apikey=" + apiKey
        // // console.log(url)
        // const response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true})
        // // console.log(response)
        // const responseContent = response.getContentText()
        // // console.log(responseContent)

        // @ts-ignore
        let stakedAmount = utilGetCryptoAmountFromApi(url, address, "result", denominator)

        // let responseJson = {}
        // let stakedAmount = 0
        // try {
        //   responseJson = JSON.parse(responseContent)
        //   // console.log(responseJson)
        //
        //   let parsedAmount = parseFloat(responseJson.result) / denominator
        //   if (parsedAmount === undefined) {
        //     throw new Error("Unable to parse value.")
        //   } else {
        //     stakedAmount += parsedAmount
        //   }
        // } catch(err) {
        //   console.log("ERROR: Failed to parse amount for address: " + address)
        // }

        console.log("STAKED: " + stakedAmount)
        totalAmount += stakedAmount
      }

      // for unclaimed MATIC (from unbonding with a validator) still awaiting Polygon network checkpoints
      if (contractAddress === "0xafe97c48b465d424d25ae3a52a722f4496ceb6e3" && validatorCount === 0) {
        const url = "https://sentinel.matic.network/api/v2/delegators/" + address + "?limit=100&offset=0&sortBy=stake&direction=DESC&type=staked"
        // console.log(url)
        // const response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true})
        // // console.log(response)
        // const responseContent = response.getContentText()
        // // console.log(responseContent)
        // const responseJson = JSON.parse(responseContent)
        // // console.log(responseJson)

        // @ts-ignore
        const responseJson = utilGetResponseJsonFromRequest(url)

        let unclaimedAmount = 0
        for (let validator of responseJson.result) {
          // noinspection JSUnresolvedVariable
          unclaimedAmount += parseFloat(validator.unclaimedAmount) / denominator
          validatorCount += 1
        }
        console.log("UNCLAIMED: " + unclaimedAmount)
        totalAmount += unclaimedAmount
      }
    }
    return totalAmount
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of public NEO/GAS/NEP-5 wallet(s).
 *
 * @param {string} assetHash - The asset hash of the NEP-5 token on the NEO platform.
 *
 * @return {function} - Function that returns total amount of the cryptocurrency stored in the wallet.
 */
function fetchNeoPlatformBalance(assetHash: string) {
  /**
   * Fetches balance(s) of public NEO/GAS/NEP-5 wallet(s).
   *
   * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
   *
   * @return {float} The total amount of the cryptocurrency stored in the wallet(s).
   */
  return function(addresses: string) {
    let totalAmount = 0
    for (let address of addresses) {
      // @ts-ignore
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      let url = "https://neoscan.io/api/main_net/v1/get_balance/" + address
      // // console.log(url)
      // let response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true})
      // // console.log(response)
      // let responseContent = response.getContentText()
      // // console.log(responseContent)
      // let responseJson = JSON.parse(responseContent)
      // // console.log(responseJson)

      // @ts-ignore
      let responseJson = utilGetResponseJsonFromRequest(url)

      let amount = 0
      // noinspection JSUnresolvedVariable
      for (let asset of responseJson.balance) {
        // noinspection JSUnresolvedVariable
        if (asset.asset_hash === assetHash) {
          amount += Number(asset.amount)
          // console.log("Amount: " + amount)
          // noinspection JSUnresolvedVariable
          if (asset.asset_symbol.toLowerCase() === "gas") {
            url = "https://neoscan.io/api/main_net/v1/get_unclaimed/" + address
            // console.log(url)
            // response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true})
            // // console.log(response)
            // responseContent = response.getContentText()
            // // console.log(responseContent)
            // responseJson = JSON.parse(responseContent)
            // // console.log(responseJson)

            // @ts-ignore
            amount += utilGetCryptoAmountFromApi(url, address, "unclaimed")

            // noinspection JSUnresolvedVariable
            // amount += Number(responseJson.unclaimed)
          }
        }
      }

      console.log("Amount: " + amount)
      totalAmount += amount
    }
    return totalAmount
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance of all public IOTA wallet receive addresses.
 *
 * @param {string} addresses - String of the public wallet addresses separated by commas.
 * 
 * @return {number} The total amount of the cryptocurrency stored in the wallet.
 */
function fetchIotaBalance(addresses: string) {
  console.log("Fetching IOTA amounts for " + addresses.length + " addresses.")

  let totalAmount = 0
  for (let address of addresses) {
    // @ts-ignore
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]
    if ("actions" in addressInfo) {
      let addressActions = addressInfo["actions"]
      console.log("Fetching IOTA balance for: " + address + " (with action" + ((addressActions.length > 1) ? "s" : "") + ": " + addressActions.join(", ") + ")")
    } else {
      console.log("Fetching IOTA balance for: " + address)
    }
    // const url = "https://explorer-api.iota.org/search/mainnet/" + address
    const url = "https://thetangle.org/api/addresses/" + address
    // // console.log(url)
    // const response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true})
    // // console.log(response)
    // const responseContent = response.getContentText()
    // // console.log(responseContent)
    //
    // let responseJson = {}
    // let amount = 0
    // try {
    //   responseJson = JSON.parse(responseContent)
    //   // console.log(responseJson)
    //
    //   // amount = parseFloat(jsonObj.address.balance) / 1000000
    //   // noinspection JSUnresolvedVariable
    //   amount = parseFloat(responseJson.balance) / 1000000
    // }
    // catch(err) {
    //   console.log("ERROR: Failed to parse amount for address: " + address)
    // }

    // @ts-ignore
    let amount = utilGetCryptoAmountFromApi(url, address, "balance", 1000000)

    console.log("Amount: " + amount)
    totalAmount += amount
  }

  return totalAmount
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of public NANO wallet(s).
 *
 * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchNanoBalance(addresses: string) {
  let totalAmount = 0
  for (let address of addresses) {
    /*
    const url = "https://api.nanocrawler.cc/v2/accounts/" + address
    // @ts-ignore
    const responseJson = utilFetchJsonFromApi(url, {"muteHttpExceptions": true})

    var amount = parseInt(responseJson.account.balance) / 1000000000000000000000000000000
    */
    ///*

    // @ts-ignore
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    const url = "https://nanolooker.com/api/rpc"
    const data = {
      "action": "account_history",
      "account": address,
      "count":"25",
      "raw":true,
      "offset":0
    }

    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      payload: JSON.stringify(data)
    }

    // // noinspection JSCheckFunctionSignatures
    // const response = UrlFetchApp.fetch(url, params)
    // // console.log(response)
    // const responseContent = response.getContentText()
    // // console.log(responseContent)
    // const responseJson = JSON.parse(responseContent)
    // // console.log(responseJson)

    // @ts-ignore
    const responseJson = utilGetResponseJsonFromRequest(url, params)

    // noinspection JSUnresolvedVariable
    let amount = Number(parseFloat(responseJson.history[0].balance).toFixed(30)) / 1000000000000000000000000000000
    //*/

    console.log("Amount: " + amount)
    totalAmount += amount
  }
  return totalAmount
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of public Banano (BAN) wallet(s).
 *
 * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchBananoBalance(addresses: string) {
  let totalAmount = 0
  for (let address of addresses) {
    // @ts-ignore
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    // const url = "https://api.creeper.banano.cc/v2/accounts/" + address
    const url = "https://api.bananode.eu/v2/accounts/" + address
    // @ts-ignore
    let amount = utilGetCryptoAmountFromApi(url, address, "account.balance", 100000000000000000000000000000)

    // noinspection JSUnresolvedVariable
    // let amount = parseInt(responseJson.account.balance) / 100000000000000000000000000000

    console.log("Amount: " + amount)
    totalAmount += amount
  }
  return totalAmount
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of public ARK wallet(s).
 *
 * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchArkBalance(addresses: string) {
  let totalAmount = 0
  for (let address of addresses) {
    // @ts-ignore
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    const url = "https://explorer.ark.io/api/wallets/" + address
    // @ts-ignore
    let amount = utilGetCryptoAmountFromApi(url, address, "data.balance", 100000000)

    // noinspection JSUnresolvedVariable
    // let amount = parseFloat(responseJson.data.balance) / 100000000
    console.log("Amount: " + amount)
    totalAmount += amount
  }
  return totalAmount
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of public BTC/LTC/DASH/DOGE wallet(s).
 *
 * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchBitcoinBalance(addresses: string) {
  let totalAmount = 0
  for (let address of addresses) {
    // @ts-ignore
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    const url = "https://blockstream.info/api/address/" + address
    // // console.log(url)
    // // noinspection JSUnresolvedVariable
    // const response = UrlFetchApp.fetch(url, params)
    // // console.log(response)
    // const responseContent = response.getContentText()
    // // console.log(responseContent)
    // const responseJson = JSON.parse(responseContent)

    // @ts-ignore
    const responseJson = utilGetResponseJsonFromRequest(url)

    // noinspection JSUnresolvedVariable
    let amount = (parseFloat(responseJson.chain_stats.funded_txo_sum) - parseFloat(responseJson.chain_stats.spent_txo_sum)) / 100000000
    console.log(amount.toString())
    totalAmount += amount
  }
  return totalAmount
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of public Binance Coin (BNB) wallet(s).
 *
 * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
 * @param {string} apiKey - Personal bscscan API key.
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchBinanceCoinBalance(addresses: string, apiKey: string) {
  let totalAmount = 0
  for (let address of addresses) {
    // @ts-ignore
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    if (address.toLowerCase().startsWith("bnb")) {
      const url = "https://api-binance-mainnet.cosmostation.io/v1/account/" + address

      // @ts-ignore
      const responseJson = utilGetResponseJsonFromRequest(url)

      let amount = 0
      // noinspection JSUnresolvedVariable
      for (let balance of responseJson.balances) {
        if (balance.symbol === "BNB") {
          // noinspection JSUnresolvedVariable
          amount += parseFloat(balance.free) + parseFloat(balance.locked) + parseFloat(balance.frozen)
        }
      }

      console.log("Amount: " + amount)
      totalAmount += amount
    } else {
      const url = "https://api.bscscan.com/api?module=account&action=balance&address=" + address + "&tag=latest&apikey=" + apiKey

      // @ts-ignore
      let amount = utilGetCryptoAmountFromApi(url, address, "result", 1000000000000000000)

      // var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
      // // console.log(response)
      // var jsonObj = JSON.parse(response)
      // // console.log(jsonObj)
      //
      // var amount = parseFloat(jsonObj.result) / 1000000000000000000

      console.log("Amount: " + amount)
      totalAmount += amount
    }
  }
  return totalAmount
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of public Algorand (ALGO) wallet(s).
 *
 * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchAlgorandBalance(addresses: string) {
  let totalAmount = 0
  for (let address of addresses) {
    // @ts-ignore
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    const url = "https://algoexplorerapi.io/v2/accounts/" + address
    // var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
    // var jsonObj = JSON.parse(response)
    // // console.log(jsonObj)

    // @ts-ignore
    const responseJson = utilGetResponseJsonFromRequest(url)

    let amount = 0
    let rewards = 0
    try {
      const parsedAmount = parseFloat(responseJson["amount-without-pending-rewards"]) / 1000000
      const parsedRewards = parseFloat(responseJson["pending-rewards"]) / 1000000
      if (parsedAmount === undefined || parsedRewards === undefined) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error("Unable to parse value.")
      } else {
        amount += parsedAmount
        rewards += parsedRewards
      }
    } catch(err) {
      console.log("ERROR: Failed to parse amount for address: " + address)
    }
    console.log("Amount: " + amount.toString())
    console.log("Rewards: " + rewards.toString())
    totalAmount += (amount + rewards)
  }
  return totalAmount
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of public Algorand token wallet(s).
 *
 * @param {string} tokenId - String of the public token id.
 * @param {number} denominator - Integer with number of zeros assigned to Algorand token to display the readable amount.
 *
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored in the wallet(s) when passed the wallet address(es).
 */
function fetchAlgorandPlatformBalance(tokenId: string, denominator: number) {
  /**
   * Fetches balance(s) of public Algorand token wallet(s).
   *
   * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
   *
   * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
   */
  return function(addresses: string) {
    let totalAmount = 0
    for (let address of addresses) {
      // @ts-ignore
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      const url = "https://algoexplorerapi.io/v2/accounts/" + address
      // var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
      // // console.log(response)
      // var jsonObj = JSON.parse(response)
      // // console.log(jsonObj)

      // @ts-ignore
      const responseJson = utilGetResponseJsonFromRequest(url)

      let amount = 0
      try {
        for (let token of responseJson.assets) {
          // noinspection TypeScriptValidateJSTypes
          let parsedTokenId = Number(token["asset-id"]).toLocaleString("fullwide", {useGrouping: false})
          if (parsedTokenId === tokenId) {
            let parsedAmount = parseFloat(String(Number(token.amount))) / denominator
            if (parsedAmount === undefined) {
              // noinspection ExceptionCaughtLocallyJS
              throw new Error("Unable to parse value.")
            } else {
              amount += parsedAmount
            }
          }
        }
      } catch(err) {
        console.log("ERROR: Failed to parse amount for address: " + address)
      }

      // noinspection TypeScriptValidateJSTypes
      console.log(Number(amount).toLocaleString("fullwide", {useGrouping: false}))
      totalAmount += amount
    }
    return totalAmount
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of staked Algorand asset (Algorand or Algorand Standard Asset (ASA)) on Yieldly.
 *
 * @param {string} appId - App ID corresponding to the Yieldly lottery staking pool.
 * @param {number} denominator - Integer with number of zeros assigned to selected cryptocurrency asset to display the readable amount.
 * @param {string} assetId - Asset ID corresponding to the selected cryptocurrency asset.
 *
 * @return {function} Function that returns the total amount of ALGO stored in the wallet(s) and/or staking contract.
 */
function fetchAlgorandPlatformYieldlyLotteryStakingBalance(appId: string, denominator: number, assetId: string) {
  /**
   * Fetches balance(s) of Algorand asset (Algorand or Algorand Standard Asset (ASA)) from both public wallet address(es) and staking contracts.
   *
   * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses) where asset was staked.
   *
   * @return {number} The total amount of the cryptocurrency stored in the wallet(s) and/or staking contract.
   */
  return function(addresses: string) {
    let totalAmount = 0
    for (let address of addresses) {
      // @ts-ignore
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      if ("actions" in addressInfo && addressInfo["actions"].includes("staking")) {
        const url = "https://api.algoexplorer.io/v2/accounts/"+ address
        // var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
        // // console.log(response)
        // var jsonObj = JSON.parse(response)
        // // console.log(jsonObj)

        // @ts-ignore
        const responseJson = utilGetResponseJsonFromRequest(url)

        let stakedAmount = 0
        try {
          let userKeyUSSuserStakingShares = 0
          let userKeyUAuserAmount = 0
          let userKeyUTuserTimeCurrentBlockTimestamp = 0
          for (let app of responseJson["apps-local-state"]) {
            // noinspection TypeScriptValidateJSTypes
            let parsedAppId = Number(app["id"]).toLocaleString("fullwide", {useGrouping: false})
            if (parsedAppId === appId) {
              for (let appKeyValue of app["key-value"]) {

                if (appKeyValue.key === "VUE=") {
                  // USS - User Staking Shares: Each user’s personal staking shares in the pool (requires a full 24 hours passed to update).
                  // noinspection JSUnresolvedVariable
                  userKeyUSSuserStakingShares = parseFloat(String(Number(appKeyValue.value.uint)))
                  // UA - User Amount: Net amount the user has staked and withdrawn.
                  userKeyUAuserAmount = userKeyUSSuserStakingShares
                  let parsedAmount = userKeyUSSuserStakingShares / denominator
                  if (parsedAmount === undefined) {
                    // noinspection ExceptionCaughtLocallyJS
                    throw new Error("Unable to parse value.")
                  } else {
                    if (assetId === "algorand") {
                      stakedAmount += parsedAmount
                    }
                  }
                }

                if (appKeyValue.key === "VVQ=") {
                  // UT - User Time: Time since the user has either staked, withdrawn or claimed.
                  // noinspection JSUnresolvedVariable
                  userKeyUTuserTimeCurrentBlockTimestamp = parseFloat(String(Number(appKeyValue.value.uint)))
                }
              }
            }
          }

          let appKeyTYULglobalUnlockRewards = 0
          let appKeyGSSglobalStakingShares = 0
          let appKeyGAtotalStaked = 0
          let appKeyGTglobalTime = 0
          if (assetId === "226701642") {
            const appUrl = "https://api.algoexplorer.io/v2/applications/" + appId
            // var appResponse = UrlFetchApp.fetch(appUrl, {"muteHttpExceptions": true}).getContentText()
            // // console.log(appResponse)
            // var appJsonObj = JSON.parse(appResponse)
            // // console.log(appJsonObj)

            // @ts-ignore
            const appResponseJson = utilGetResponseJsonFromRequest(appUrl)

            for (let key of appResponseJson.params["global-state"]) {

              if (key.key === "VFlVTA==") {
                // TYUL - Total Rewards Unlocked: Claimable YLDY from the prize game and staking pools.
                // noinspection JSUnresolvedVariable
                appKeyTYULglobalUnlockRewards = parseFloat(String(Number(key.value.uint)))
              }

              if (key.key === "R1NT") {
                // GSS - Global Staking Shares: Total amount of shares accumulated from all users inside the pool.
                // noinspection JSUnresolvedVariable
                appKeyGSSglobalStakingShares = parseFloat(String(Number(key.value.uint)))
              }

              if (key.key === "R0E=") {
                // GA - Global Amount: How much everyone in the pool has staked and withdrawn.
                // noinspection JSUnresolvedVariable
                appKeyGAtotalStaked = parseFloat(String(Number(key.value.uint)))
              }

              if (key.key === "R1Q=") {
                // GT - Global Time: Time since the user has either staked, withdrawn or claimed.
                // noinspection JSUnresolvedVariable
                appKeyGTglobalTime = parseFloat(String(Number(key.value.uint)))
              }
            }

            // https://www.reddit.com/r/yieldly/comments/peg1wk/get_yldy_claimable_rewards_using_algoexplorer_api/
            // https://www.reddit.com/r/yieldly/comments/pbpqrb/api/

            // https://github.com/JoshLmao/ydly-calc
            // GT: Global Time
            // GSS: Global Staking Shares
            // USS: User Staking Shares
            // UA: User Amount
            // UT: User Time
            // Claimable YLDY Rewards = ((USS + ((GT - UT) / 86400) * UA) / GSS) * TYUL / 1000000
            let yieldlyClaimableRewards = ((userKeyUSSuserStakingShares + ((appKeyGTglobalTime - userKeyUTuserTimeCurrentBlockTimestamp) / 86400) * userKeyUAuserAmount) / appKeyGSSglobalStakingShares) * appKeyTYULglobalUnlockRewards / denominator
            console.log("Yieldly claimable Rewards: " + yieldlyClaimableRewards)
            totalAmount += yieldlyClaimableRewards
          }
        } catch(err) {
          console.log("ERROR: Failed to parse amount for address: " + address)
        }

        console.log("Staking: " + stakedAmount)
        totalAmount += stakedAmount
      }
    }
    return totalAmount
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of staked Algorand asset (Algorand or Algorand Standard Asset (ASA)) on Yieldly.
 *
 * @param {Array[string]} appIds - List of app IDs corresponding to Yieldly staking pools.
 * @param {number} denominator - Integer with number of zeros assigned to selected cryptocurrency asset to display the readable amount.
 * @param {string} assetId - Asset ID corresponding to the selected cryptocurrency asset.
 *
 * @return {function} The total amount of ALGO stored in the wallet(s) and/or staking contract.
 */
function fetchAlgorandPlatformYieldlyPoolStakingBalance(appIds: Array<string>, denominator: number, assetId: string) {
  /**
   * Fetches balance(s) of Algorand asset (Algorand or Algorand Standard Asset (ASA)) from both public wallet address(es) and staking contracts.
   *
   * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses) where asset was staked.
   *
   * @return {number} The total amount of the cryptocurrency stored in the wallet(s) and/or staking contract.
   */
  return function(addresses: string) {

    const urlStakingPools = "https://app.yieldly.finance/staking/pools"
    // var responseStakingPools = UrlFetchApp.fetch(urlStakingPools, {"muteHttpExceptions": true}).getContentText()
    // // console.log(responseStakingPools)
    // var jsonObjStakingPools = JSON.parse(responseStakingPools)
    // // utilPrettyPrintJson(jsonObjStakingPools)

    // @ts-ignore
    const stakingPoolsResponseJson = utilGetResponseJsonFromRequest(urlStakingPools)

    let totalAmount = 0
    for (let address of addresses) {
      // @ts-ignore
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      if ("actions" in addressInfo && addressInfo["actions"].includes("staking")) {
        const url = "https://api.algoexplorer.io/v2/accounts/"+ address
        // var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
        // // console.log(response)
        // var jsonObj = JSON.parse(response)
        // // console.log(jsonObj)

        // @ts-ignore
        const responseJson = utilGetResponseJsonFromRequest(url)

        let stakedAmount = 0
        try {
          for (let appId of appIds) {
            let stakingTokenAssetId
            let rewardsTokensAssetIds = []
            for (let pool of stakingPoolsResponseJson) {
              // noinspection TypeScriptValidateJSTypes
              let parsedPoolId = Number(pool["Id"]).toLocaleString("fullwide", {useGrouping: false})
              if (parsedPoolId === appId) {
                // noinspection TypeScriptValidateJSTypes
                stakingTokenAssetId = Number(pool["StakingToken"]["TokenAssetId"]).toLocaleString("fullwide", {useGrouping: false})
                // noinspection TypeScriptValidateJSTypes
                rewardsTokensAssetIds = pool["RewardToken"].map((value: {[key: string]: any}) => Number(value["TokenAssetId"]).toLocaleString("fullwide", {useGrouping: false}))
              }
            }
            if (appId === "233725850") {
              rewardsTokensAssetIds.push("algorand")
            }

            for (let app of responseJson["apps-local-state"]) {
              // noinspection TypeScriptValidateJSTypes
              let parsedAppId = Number(app["id"]).toLocaleString("fullwide", {useGrouping: false})
              if (parsedAppId === appId && rewardsTokensAssetIds.includes(assetId)) {

                let userKeyUSSuserStakingShares = 0
                let userKeyUAuserAmount = 0
                let userKeyUTuserTimeCurrentBlockTimestamp = 0
                for (let appKeyValue of app["key-value"]) {
                  if (appKeyValue.key === "VUE=") {
                    // USS - User Staking Shares: Each user’s personal staking shares in the pool (requires a full 24 hours passed to update).
                    // noinspection JSUnresolvedVariable
                    userKeyUSSuserStakingShares = parseFloat(String(Number(appKeyValue.value.uint)))
                    // UA - User Amount: Net amount the user has staked and withdrawn.
                    userKeyUAuserAmount = userKeyUSSuserStakingShares
                    let parsedAmount = userKeyUSSuserStakingShares / denominator
                    if (parsedAmount === undefined) {
                      // noinspection ExceptionCaughtLocallyJS
                      throw new Error("Unable to parse value.")
                    } else {
                      if (assetId !== "algorand") {
                        stakedAmount += parsedAmount
                      }
                    }
                  }

                  if (appKeyValue.key === "VVQ=") {
                    // UT - User Time: Time since the user has either staked, withdrawn or claimed.
                    // noinspection JSUnresolvedVariable
                    userKeyUTuserTimeCurrentBlockTimestamp = parseFloat(String(Number(appKeyValue.value.uint)))
                  }
                }

                const appUrl = "https://api.algoexplorer.io/v2/applications/" + appId
                // var appResponse = UrlFetchApp.fetch(appUrl, {"muteHttpExceptions": true}).getContentText()
                // // console.log(appResponse)
                // var appJsonObj = JSON.parse(appResponse)
                // // utilPrettyPrintJson(appJsonObj)

                // @ts-ignore
                const appResponseJson = utilGetResponseJsonFromRequest(appUrl)

                let appKeyTYULprimaryGlobalUnlockRewards = 0
                let appKeyGSSglobalStakingShares = 0
                let appKeyGAtotalStaked = 0
                let appKeyGTglobalTime = 0
                let appKeyTYULsecondaryGlobalUnlockRewards = 0
                for (let key of appResponseJson.params["global-state"]) {

                  if (key.key === "VFlVTA==") {
                    // TYUL - Total Rewards Unlocked: Claimable rewards from the staking pool.
                    // noinspection JSUnresolvedVariable
                    appKeyTYULprimaryGlobalUnlockRewards = parseFloat(String(Number(key.value.uint)))
                  }

                  if (key.key === "R1NT") {
                    // GSS - Global Staking Shares: Total amount of shares accumulated from all users inside the pool.
                    // noinspection JSUnresolvedVariable
                    appKeyGSSglobalStakingShares = parseFloat(String(Number(key.value.uint)))
                  }

                  if (key.key === "R0E=") {
                    // GA - Global Amount: How much everyone in the pool has staked and withdrawn.
                    // noinspection JSUnresolvedVariable
                    appKeyGAtotalStaked = parseFloat(String(Number(key.value.uint)))
                  }

                  if (key.key === "R1Q=") {
                    // GT - Global Time: Time since the user has either staked, withdrawn or claimed.
                    // noinspection JSUnresolvedVariable
                    appKeyGTglobalTime = parseFloat(String(Number(key.value.uint)))
                  }

                  if (key.key === "VEFQ") {
                    // Secondary TYUL - Total Secondary Rewards Unlocked: Claimable secondary rewards from the staking pool.
                    // noinspection JSUnresolvedVariable
                    appKeyTYULsecondaryGlobalUnlockRewards = parseFloat(String(Number(key.value.uint)))
                  }
                }

                // https://www.reddit.com/r/yieldly/comments/peg1wk/get_yldy_claimable_rewards_using_algoexplorer_api/
                // https://www.reddit.com/r/yieldly/comments/pbpqrb/api/

                // https://github.com/JoshLmao/ydly-calc
                // GT: Global Time
                // GSS: Global Staking Shares
                // USS: User Staking Shares
                // UA: User Amount
                // UT: User Time
                // Claimable YLDY Rewards = ((USS + ((GT - UT) / 86400) * UA) / GSS) * TYUL / 1000000
                let appKeyTYULglobalUnlockRewards
                if (assetId === "algorand") {
                  appKeyTYULglobalUnlockRewards = appKeyTYULsecondaryGlobalUnlockRewards
                } else {
                  appKeyTYULglobalUnlockRewards = appKeyTYULprimaryGlobalUnlockRewards
                }
                let claimableRewards = ((userKeyUSSuserStakingShares + ((appKeyGTglobalTime - userKeyUTuserTimeCurrentBlockTimestamp) / 86400) * userKeyUAuserAmount) / appKeyGSSglobalStakingShares) * appKeyTYULglobalUnlockRewards / denominator
                console.log("Claimable Rewards: " + claimableRewards)
                totalAmount += claimableRewards
              }
            }
          }
        } catch(err) {
          console.log("ERROR: Failed to parse amount for address: " + address)
        }

        console.log("Staking: " + stakedAmount)
        totalAmount += stakedAmount
      }
    }
    return totalAmount
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of staked Algorand asset (Algorand or Algorand Standard Asset (ASA)) on AlgoFi.
 *
 * @param {Array[string]} appIds - List of app IDs corresponding to AlgoFi staking pools.
 * @param {number} denominator - Integer with number of zeros assigned to selected cryptocurrency asset to display the readable amount.
 * @param {string} assetId - Asset ID corresponding to the selected cryptocurrency asset.
 *
 * @return {function} The total amount of DEFLY stored in the wallet(s) and/or staking contract.
 */
function fetchAlgorandPlatformAlgoFiStakingBalance(appIds: Array<string>, denominator: number, assetId: string) {
  /**
   * Fetches balance(s) of Algorand asset (Algorand or Algorand Standard Asset (ASA)) from both public wallet address(es) and staking contracts.
   *
   * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses) where asset was staked.
   *
   * @return {number} The total amount of the cryptocurrency stored in the wallet(s) and/or staking contract.
   */
  return function(addresses: string) {

    let totalAmount = 0
    for (let address of addresses) {
      // @ts-ignore
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      if ("actions" in addressInfo && addressInfo["actions"].includes("staking")) {
        const dynamicallyCreatedStakingAddress = addressInfo["actions"][addressInfo["actions"].indexOf("staking") + 1]
        const url = "https://indexer.algoexplorerapi.io/v2/accounts/" + dynamicallyCreatedStakingAddress + "?include-all=true"
        // var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
        // // console.log(response)
        // var jsonObj = JSON.parse(response)
        // // console.log(jsonObj)

        // @ts-ignore
        const responseJson = utilGetResponseJsonFromRequest(url)

        let stakedAmount = 0
        try {
          for (let appId of appIds) {
            for (let app of responseJson.account["apps-local-state"]) {
              // noinspection TypeScriptValidateJSTypes
              let parsedAppId = Number(app["id"]).toLocaleString("fullwide", {useGrouping: false})
              if (parsedAppId === appId) {

                let userKeyUSSuserStakingShares = 0
                let userKeyUAuserAmount = 0
                for (let appKeyValue of app["key-value"]) {
                  if (appKeyValue.key === "dWFj") {
                    // USS - User Staking Shares: Each user’s personal staking shares in the pool (requires a full 24 hours passed to update).
                    // noinspection JSUnresolvedVariable
                    userKeyUSSuserStakingShares = parseFloat(String(Number(appKeyValue.value.uint)))
                    // UA - User Amount: Net amount the user has staked and withdrawn.
                    userKeyUAuserAmount = userKeyUSSuserStakingShares
                    let parsedAmount = userKeyUSSuserStakingShares / denominator
                    if (parsedAmount === undefined) {
                      // noinspection ExceptionCaughtLocallyJS
                      throw new Error("Unable to parse value.")
                    } else {
                      if (assetId !== "algorand") {
                        stakedAmount += parsedAmount
                      }
                    }
                  }
                }

                // var appUrl = "https://api.algoexplorer.io/v2/applications/" + appId
                // var appResponse = UrlFetchApp.fetch(appUrl, {"muteHttpExceptions": true}).getContentText()
                // // console.log(appResponse)
                // var appJsonObj = JSON.parse(appResponse)
                // // utilPrettyPrintJson(appJsonObj)

                // for (let key of appJsonObj.params["global-state"]) {

                //   if (key.key === "VFlVTA==") {
                //     // TYUL - Total Rewards Unlocked: Claimable rewards from the staking pool.
                //     var appKeyTYULprimaryGlobalUnlockRewards = parseFloat(Number(key.value.uint))
                //   }

                //   if (key.key === "R1NT") {
                //     // GSS - Global Staking Shares: Total amount of shares accumulated from all users inside the pool.
                //     var appKeyGSSglobalStakingShares = parseFloat(Number(key.value.uint))
                //   }

                //   if (key.key === "R0E=") {
                //     // GA - Global Amount: How much everyone in the pool has staked and withdrawn.
                //     var appKeyGAtotalStaked = parseFloat(Number(key.value.uint))
                //   }

                //   if (key.key === "R1Q=") {
                //     // GT - Global Time: Time since the user has either staked, withdrawn or claimed.
                //     var appKeyGTglobalTime = parseFloat(Number(key.value.uint))
                //   }

                //   if (key.key === "VEFQ") {
                //     // Secondary TYUL - Total Secondary Rewards Unlocked: Claimable secondary rewards from the staking pool.
                //     var appKeyTYULsecondaryGlobalUnlockRewards = parseFloat(Number(key.value.uint))
                //   }
                // }

                // // https://www.reddit.com/r/yieldly/comments/peg1wk/get_yldy_claimable_rewards_using_algoexplorer_api/
                // // https://www.reddit.com/r/yieldly/comments/pbpqrb/api/

                // // https://github.com/JoshLmao/ydly-calc
                // // GT: Global Time
                // // GSS: Global Staking Shares
                // // USS: User Staking Shares
                // // UA: User Amount
                // // UT: User Time
                // // Claimable YLDY Rewards = ((USS + ((GT - UT) / 86400) * UA) / GSS) * TYUL / 1000000
                // let appKeyTYULglobalUnlockRewards
                // if (assetId === "algorand") {
                //   appKeyTYULglobalUnlockRewards = appKeyTYULsecondaryGlobalUnlockRewards
                // } else {
                //   appKeyTYULglobalUnlockRewards = appKeyTYULprimaryGlobalUnlockRewards
                // }
                // var claimableRewards = ((userKeyUSSuserStakingShares + ((appKeyGTglobalTime - userKeyUTuserTimeCurrentBlockTimestamp) / 86400) * userKeyUAuserAmount) / appKeyGSSglobalStakingShares) * appKeyTYULglobalUnlockRewards / denominator
                // console.log("Claimable Rewards: " + claimableRewards)
                // totalAmount += claimableRewards
              }
            }
          }
        } catch(err) {
          console.log("ERROR: Failed to parse amount for address: " + address)
        }

        console.log("Staking: " + stakedAmount)
        totalAmount += stakedAmount
      }
    }
    return totalAmount
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches total balance of all Monero wallet send and receive transactions.
 *
 * @param {string} transactions - String of the wallet transactions separated by commas and formatted as txType:txId:txAddress:txKey/txSendAmount
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet.
 */
function fetchMoneroBalance(transactions: string) {
  let totalAmount = 0
  for (let transaction of transactions) {
    let txComponents = transaction.split(":")
    let txType = txComponents[0]
    let txId = txComponents[1]
    let txAddress = txComponents[2]
    let txKey
    let txSendAmount
    let txSendFee

    let privateViewkey

    let url
    let amount = 0
    if (txType === "receive") {
      privateViewkey = txComponents[3]
      url = "https://xmrchain.net/api/outputs?txhash=" + txId + "&address=" + txAddress + "&viewkey=" + privateViewkey
      // var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
      // var jsonObj = JSON.parse(response)
      // // console.log(jsonObj)

      // @ts-ignore
      const responseJson = utilGetResponseJsonFromRequest(url)

      for (let balance of responseJson.data.outputs) {
        // console.log(balance)
        amount += parseFloat(String(Number(balance.amount))) / 1000000000000
      }
    } else if (txType === "send") {
      txSendAmount = Number(txComponents[3])
      if (isNaN(txSendAmount)) {
        txKey = txComponents[3]
        url = "https://xmrchain.net/api/outputs?txhash=" + txId + "&address=" + txAddress + "&viewkey=" + txKey + "&txprove=1"
        // var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
        // var jsonObj = JSON.parse(response)
        // // console.log(jsonObj)

        // @ts-ignore
        const responseJson = utilGetResponseJsonFromRequest(url)

        for (let balance of responseJson.data.outputs) {
          // console.log(balance)
          amount -= parseFloat(String(Number(balance.amount))) / 1000000000000
        }
      } else {
        amount -= txSendAmount
      }

      url = "https://xmrchain.net/api/transaction/" + txId
      // var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
      // var jsonObj = JSON.parse(response)
      // // console.log(jsonObj)

      // @ts-ignore
      const responseJson = utilGetResponseJsonFromRequest(url)

      // noinspection JSUnresolvedVariable
      txSendFee = parseFloat(String(Number(responseJson.data.tx_fee))) / 1000000000000
      console.log("Send fee: " + txSendFee)
      amount -= txSendFee
    }

    console.log("Amount: " + amount)
    totalAmount += amount
  }
  return totalAmount
}

export {CRYPTO_WALLET_TICKERS, CRYPTO_WALLET_BALANCE}
