// import {utilParseCryptoAddresses, utilCleanAddress, utilCheckArrayExistsAndNotEmpty, utilPrettyPrintJson} from "../utils/CryptoWalletUtils.js"

/**
 * All supported cryptocurrencies of CRYPTO_WALLET_BALANCE.
 *
 * @return {array} - An array of all supported cryptocurrency tickers supported by CRYPTO_WALLET_BALANCE.
 * @customfunction
 */
function CRYPTO_WALLET_TICKERS(refresh = true) {
  let tickerArray = Object.keys(getCryptoWalletAssets())
  Logger.log(tickerArray)
  return tickerArray.sort()
}

/**
 * Retrieve cryptocurrency wallet balance(s) for chosen asset.
 *
 * @param {string} cryptocurrency - The ticker for the selected cryptocurrency.
 * @param {string} walletAddresses - The public wallet address(es).
 * @param {string} token - The contract address or asset hash of a ERC20/NEP-5 token/asset on the Ethereum or NEO platforms.
 * @param {string} refreshVar - Unused variable used to refresh function.
 * @param {string} apiKey - Personal etherscan.io API key for use with ETH and ERC20 assets.
 * @return {float} - The total amount of the cryptocurrency stored in the wallet.
 * @customfunction
 */
function CRYPTO_WALLET_BALANCE(cryptocurrency, walletAddresses, apiKey = null, refresh = true) {

  walletAddresses = utilParseCryptoAddresses(walletAddresses).filter(Boolean)
  Logger.log(walletAddresses)

  var cryptoAssets = getCryptoWalletAssets()

  cryptocurrency = cryptocurrency.toUpperCase()
  var randomDelay = Math.floor(Math.random() * 1000)
  Utilities.sleep(randomDelay)

  var amount
  if (cryptoAssets.hasOwnProperty(cryptocurrency)) {
    // var amount = cryptoAssets[cryptocurrency](walletAddresses, apiKey)
    var amount = cryptoAssets[cryptocurrency].reduce((prevFunc, currFunc) => {return () => prevFunc(walletAddresses, apiKey) + currFunc(walletAddresses, apiKey)}, () => 0)()
    Logger.log(`Total amount of ${cryptocurrency.toUpperCase()}: ${amount.toPrecision()}`)
  } else {
    throw "Cryptocurrency " + cryptocurrency + " is not yet supported! " +
    "Call CRYPTO_WALLET_TICKERS to get an array of currently supported cryptocurrencies. " +
    "Please contect developer to request support for additional crypto assets."
  }

  if (!isNaN(amount)){
    return amount
  } else {
    // RETURN for testing only
    //return amount
    throw "Retrieval of cryptocurrency " + cryptocurrency + " failed. " +
    "It is possible that there was a problem with the API used for this asset. " +
    "Please contact developer to report this issue."
  }
}

/**
 * Retrieve supported cryptocurrency function array for CRYPTO_WALLET_BALANCE.
 *
 * @return {array} - All assets supported by CRYPTO_WALLET_BALANCE and their curried functions.
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

/**
 * Fetches balance(s) of public ETH wallet(s).
 *
 * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
 * @param {string} apiKey - Personal etherscan.io API key.
 * @return {float} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchEthereumBalance(addresses, apiKey) {
  var totalAmount = 0
  for (let address of addresses) {
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    var url = "https://api.etherscan.io/api?module=account&action=balance&address=" + address + "&tag=latest&apikey=" + apiKey
    var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
    var jsonObj = JSON.parse(response)
    // Logger.log(jsonObj)

    var amount = parseFloat(jsonObj.result) / 1000000000000000000
    Logger.log("Amount: " + amount)
    totalAmount += amount
  }
  return totalAmount
}

/**
 * Fetches balance(s) of public ERC20 wallet(s).
 *
 * @param {string} contractAddress - String of the public wallet address.
 * @param {integer} denominator - Integer with number of zeros assigned to ERC20 token to display the readable amount.
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored in the wallet(s) when passed the wallet address(es) and API key.
 */
function fetchEthereumPlatformBalance(contractAddress, denominator) {
  /**
   * Fetches balance(s) of public ERC20 wallet(s).
   *
   * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
   * @param {string} apiKey - Personal etherscan.io API key.
   * @return {float} The total amount of the cryptocurrency stored in the wallet(s).
   */
  return function(addresses, apiKey) {
    var totalAmount = 0
    for (let address of addresses) {
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      var url = "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress="+ contractAddress + "&address="+ address + "&tag=latest&apikey=" + apiKey
      var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
      // Logger.log(response)

      var jsonObj = {}
      var amount = 0
      try {
        jsonObj = JSON.parse(response)
        // Logger.log(jsonObj)

        var parsedAmount = parseFloat(jsonObj.result) / denominator
        if (parsedAmount === undefined) {
          throw new Error("Unable to parse value.")
        } else {
          amount += parsedAmount
        }
      } catch(err) {
        Logger.log("ERROR: Failed to parse amount for address: " + address)
      }

      Logger.log("Amount: " + amount)
      totalAmount += amount
    }
    return totalAmount
  }
}

/**
 * Fetches balance(s) of staked ERC20 tokens.
 *
 * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses) from which ERC20 tokens were staked.
 * @return {float} The total amount of the ERC20 tokens stored in the wallet(s) and/or staking contract.
 */
function fetchEthereumPlatformStakingBalance(contractAddress, denominator) {
  /**
   * Fetches balance(s) of stakeable ERC20 tokens from both public wallet address(es) and staking contracts.
   *
   * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
   * @param {string} apiKey - Personal etherscan.io API key.
   * @return {float} The total amount of the cryptocurrency stored in the wallet(s) and/or staking contract.
   */
  return function(addresses, apiKey) {
    var totalAmount = 0
    var validatorCount = 0
    for (let address of addresses) {
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      if ("actions" in addressInfo && addressInfo["actions"].includes("staking")) {
        var url = "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress="+ contractAddress + "&address="+ address + "&tag=latest&apikey=" + apiKey
        var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
        // Logger.log(response)

        var jsonObj = {}
        var stakedAmount = 0
        try {
          jsonObj = JSON.parse(response)
          // Logger.log(jsonObj)

          var parsedAmount = parseFloat(jsonObj.result) / denominator
          if (parsedAmount === undefined) {
            throw new Error("Unable to parse value.")
          } else {
            stakedAmount += parsedAmount
          }
        } catch(err) {
          Logger.log("ERROR: Failed to parse amount for address: " + address)
        }

        Logger.log("STAKED: " + stakedAmount)
        totalAmount += stakedAmount
      }

      // for unclaimed MATIC (from unbonding with a validator) still awaiting Polygon network checkpoints
      if (contractAddress === "0xafe97c48b465d424d25ae3a52a722f4496ceb6e3" && validatorCount === 0) {
        var url = "https://sentinel.matic.network/api/v2/delegators/" + address + "?limit=100&offset=0&sortBy=stake&direction=DESC&type=staked"
        var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
        var jsonObj = JSON.parse(response)
        // Logger.log(jsonObj)

        let unclaimedAmount = 0
        for (let validator of jsonObj.result) {
          unclaimedAmount += parseFloat(validator.unclaimedAmount) / denominator
          validatorCount += 1
        }
        Logger.log("UNCLAIMED: " + unclaimedAmount)
        totalAmount += unclaimedAmount
      }
    }
    return totalAmount
  }
}

/**
 * Fetches balance(s) of public NEO/GAS/NEP-5 wallet(s).
 *
 * @param {string} assetHash - The asset hash of the NEP-5 token on the NEO platform.
 * @return {function} - Function that returns total amount of the cryptocurrency stored in the wallet.
 */
function fetchNeoPlatformBalance(assetHash) {
  /**
   * Fetches balance(s) of public NEO/GAS/NEP-5 wallet(s).
   *
   * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
   * @return {float} The total amount of the cryptocurrency stored in the wallet(s).
   */
  return function(addresses) {
    var totalAmount = 0
    for (let address of addresses) {
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      var url = "https://neoscan.io/api/main_net/v1/get_balance/" + address
      var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
      var jsonObj = JSON.parse(response)
      // Logger.log(jsonObj)

      var amount = 0
      for (let asset of jsonObj.balance) {
        if (asset.asset_hash === assetHash) {
          amount += Number(asset.amount)
          // Logger.log("Amount: " + amount)
          if (asset.asset_symbol.toLowerCase() === "gas") {
            var url = "https://neoscan.io/api/main_net/v1/get_unclaimed/" + address
            var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
            var jsonObj = JSON.parse(response)
            // Logger.log(jsonObj)

            amount += Number(jsonObj.unclaimed)
          }
        }
      }

      Logger.log("Amount: " + amount)
      totalAmount += amount
    }
    return totalAmount
  }
}

/**
 * Fetches balance of all public IOTA wallet receive addresses.
 *
 * @param {string} addresses - String of the public wallet addresses separated by commas.
 * @return {float} The total amount of the cryptocurrency stored in the wallet.
 */
function fetchIotaBalance(addresses) {
  Logger.log("Fetching IOTA amounts for " + addresses.length + " addresses.")

  var totalAmount = 0
  for (let address of addresses) {
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]
    if ("actions" in addressInfo) {
      let addressActions = addressInfo["actions"]
      Logger.log("Fetching IOTA balance for: " + address + " (with action" + ((addressActions.length > 1) ? "s" : "") + ": " + addressActions.join(", ") + ")")
    } else {
      Logger.log("Fetching IOTA balance for: " + address)
    }
    // var url = "https://explorer-api.iota.org/search/mainnet/" + address
    var url = "https://thetangle.org/api/addresses/" + address
    var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
    // Logger.log(response)

    var jsonObj = {}
    var amount = 0
    try {
      jsonObj = JSON.parse(response)
      // Logger.log(jsonObj)

      // amount = parseFloat(jsonObj.address.balance) / 1000000
      amount = parseFloat(jsonObj.balance) / 1000000
    }
    catch(err) {
      Logger.log("ERROR: Failed to parse amount for address: " + address)
    }

    Logger.log("Amount: " + amount)
    totalAmount += amount
  }

  return totalAmount
}

/**
 * Fetches balance(s) of public NANO wallet(s).
 *
 * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
 * @return {float} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchNanoBalance(addresses) {
  var totalAmount = 0
  for (let address of addresses) {
    /*
    var url = "https://api.nanocrawler.cc/v2/accounts/" + address
    var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()

    var jsonObj = JSON.parse(response)
    var amount = parseInt(jsonObj.account.balance) / 1000000000000000000000000000000
    */
    ///*
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    var url = "https://nanolooker.com/api/rpc"
    var data = {
      "action": "account_history",
      "account": address,
      "count":"25",
      "raw":true,
      "offset":0
    }
    var response = UrlFetchApp.fetch(url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        payload: JSON.stringify(data)
      }
    ).getContentText()
    var jsonObj = JSON.parse(response)
    // Logger.log(jsonObj)

    var amount = parseFloat(jsonObj.history[0].balance).toFixed(30) / 1000000000000000000000000000000
    //*/

    Logger.log("Amount: " + amount)
    totalAmount += amount
  }
  return totalAmount
}

/**
 * Fetches balance(s) of public Banano (BAN) wallet(s).
 *
 * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
 * @return {float} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchBananoBalance(addresses) {
  var totalAmount = 0
  for (let address of addresses) {
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    // var url = "https://api.creeper.banano.cc/v2/accounts/" + address
    var url = "https://api.bananode.eu/v2/accounts/" + address
    var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
    var jsonObj = JSON.parse(response)
    // Logger.log(jsonObj)

    var amount = parseInt(jsonObj.account.balance) / 100000000000000000000000000000

    Logger.log("Amount: " + amount)
    totalAmount += amount
  }
  return totalAmount
}

/**
 * Fetches balance(s) of public ARK wallet(s).
 *
 * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
 * @return {float} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchArkBalance(addresses) {
  var totalAmount = 0
  for (let address of addresses) {
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    var url = "https://explorer.ark.io/api/wallets/" + address
    var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
    var jsonObj = JSON.parse(response)
    // Logger.log(jsonObj)

    var amount = parseFloat(jsonObj.data.balance) / 100000000
    Logger.log("Amount: " + amount)
    totalAmount += amount
  }
  return totalAmount
}

/**
 * Fetches balance(s) of public BTC/LTC/DASH/DOGE wallet(s).
 *
 * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
 * @return {float} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchBitcoinBalance(addresses) {
  var totalAmount = 0
  for (let address of addresses) {
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    var url = "https://blockstream.info/api/address/" + address
    var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
    var jsonObj = JSON.parse(response)
    // Logger.log(jsonObj)

    var amount = (parseFloat(jsonObj.chain_stats.funded_txo_sum) - parseFloat(jsonObj.chain_stats.spent_txo_sum)) / 100000000
    Logger.log(amount.toString())
    totalAmount += amount
  }
  return totalAmount
}

/**
 * Fetches balance(s) of public Binance Coin (BNB) wallet(s).
 *
 * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
 * @return {float} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchBinanceCoinBalance(addresses, apiKey) {
  var totalAmount = 0
  for (let address of addresses) {
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    if (address.toLowerCase().startsWith("bnb")) {
      var url = "https://api-binance-mainnet.cosmostation.io/v1/account/" + address
      var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
      var jsonObj = JSON.parse(response)
      // Logger.log(jsonObj)

      var amount = 0
      for (let balance of jsonObj.balances) {
        if (balance.symbol === "BNB") {
          amount += parseFloat(balance.free) + parseFloat(balance.locked) + parseFloat(balance.frozen)
        }
      }

      Logger.log("Amount: " + amount)
      totalAmount += amount
    } else {
      var url = "https://api.bscscan.com/api?module=account&action=balance&address=" + address + "&tag=latest&apikey=" + apiKey
      var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
      // Logger.log(response)
      var jsonObj = JSON.parse(response)
      // Logger.log(jsonObj)

      var amount = parseFloat(jsonObj.result) / 1000000000000000000

      Logger.log("Amount: " + amount)
      totalAmount += amount
    }
  }
  return totalAmount
}

/**
 * Fetches balance(s) of public Algorand (ALGO) wallet(s).
 *
 * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
 * @return {float} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchAlgorandBalance(addresses) {
  var totalAmount = 0
  for (let address of addresses) {
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    var url = "https://algoexplorerapi.io/v2/accounts/" + address
    var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
    var jsonObj = JSON.parse(response)
    // Logger.log(jsonObj)

    var amount = 0
    var rewards = 0
    try {
      var parsedAmount = parseFloat(jsonObj["amount-without-pending-rewards"]) / 1000000
      var parsedRewards = parseFloat(jsonObj["pending-rewards"]) / 1000000
      if (parsedAmount === undefined || parsedRewards === undefined) {
        throw new Error("Unable to parse value.")
      } else {
        amount += parsedAmount
        rewards += parsedRewards
      }
    } catch(err) {
      Logger.log("ERROR: Failed to parse amount for address: " + address)
    }
    Logger.log("Amount: " + amount.toString())
    Logger.log("Rewards: " + rewards.toString())
    totalAmount += (amount + rewards)
  }
  return totalAmount
}

/**
 * Fetches balance(s) of public Algorand token wallet(s).
 *
 * @param {string} tokenId - String of the public token id.
 * @param {integer} denominator - Integer with number of zeros assigned to Algorand token to display the readable amount.
 * @return {function} - Function that returns the total amount of the chosen cryptocurrency stored in the wallet(s) when passed the wallet address(es).
 */
function fetchAlgorandPlatformBalance(tokenId, denominator) {
  /**
   * Fetches balance(s) of public Algorand token wallet(s).
   *
   * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
   * @return {float} The total amount of the cryptocurrency stored in the wallet(s).
   */
  return function(addresses) {
    var totalAmount = 0
    for (let address of addresses) {
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      var url = "https://algoexplorerapi.io/v2/accounts/" + address
      var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
      // Logger.log(response)
      var jsonObj = JSON.parse(response)
      // Logger.log(jsonObj)

      var amount = 0
      try {
        for (let token of jsonObj.assets) {
          let parsedTokenId = Number(token["asset-id"]).toLocaleString("fullwide", {useGrouping: false})
          if (parsedTokenId === tokenId) {
            var parsedAmount = parseFloat(Number(token.amount)) / denominator
            if (parsedAmount === undefined) {
              throw new Error("Unable to parse value.")
            } else {
              amount += parsedAmount
            }
          }
        }
      } catch(err) {
        Logger.log("ERROR: Failed to parse amount for address: " + address)
      }

      Logger.log(Number(amount).toLocaleString("fullwide", {useGrouping: false}))
      totalAmount += amount
    }
    return totalAmount
  }
}

/**
 * Fetches balance(s) of staked Algorand asset (Algorand or Algorand Standard Asset (ASA)) on Yieldly.
 *
 * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses) where asset was staked.
 * @return {float} The total amount of ALGO stored in the wallet(s) and/or staking contract.
 */
function fetchAlgorandPlatformYieldlyLotteryStakingBalance(appId, denominator, assetId) {
  /**
   * Fetches balance(s) of Algorand asset (Algorand or Algorand Standard Asset (ASA)) from both public wallet address(es) and staking contracts.
   *
   * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
   * @return {float} The total amount of the cryptocurrency stored in the wallet(s) and/or staking contract.
   */
  return function(addresses) {
    var totalAmount = 0
    for (let address of addresses) {
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      if ("actions" in addressInfo && addressInfo["actions"].includes("staking")) {
        var url = "https://api.algoexplorer.io/v2/accounts/"+ address
        var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
        // Logger.log(response)
        var jsonObj = JSON.parse(response)
        // Logger.log(jsonObj)

        var stakedAmount = 0
        try {
          for (let app of jsonObj["apps-local-state"]) {
            let parsedAppId = Number(app["id"]).toLocaleString("fullwide", {useGrouping: false})
            if (parsedAppId === appId) {
              for (let appKeyValue of app["key-value"]) {

                if (appKeyValue.key === "VUE=") {
                  // USS - User Staking Shares: Each user’s personal staking shares in the pool (requires a full 24 hours passed to update).
                  var userKeyUSSuserStakingShares = parseFloat(Number(appKeyValue.value.uint))
                  // UA - User Amount: Net amount the user has staked and withdrawn.
                  var userKeyUAuserAmount = userKeyUSSuserStakingShares
                  var parsedAmount = userKeyUSSuserStakingShares / denominator
                  if (parsedAmount === undefined) {
                    throw new Error("Unable to parse value.")
                  } else {
                    if (assetId === "algorand") {
                      stakedAmount += parsedAmount
                    }
                  }
                }

                if (appKeyValue.key === "VVQ=") {
                  // UT - User Time: Time since the user has either staked, withdrawn or claimed.
                  var userKeyUTuserTimeCurrentBlockTimestamp = parseFloat(Number(appKeyValue.value.uint))
                }
              }
            }
          }
          if (assetId === "226701642") {
            var appUrl = "https://api.algoexplorer.io/v2/applications/" + appId
            var appResponse = UrlFetchApp.fetch(appUrl, {"muteHttpExceptions": true}).getContentText()
            // Logger.log(appResponse)
            var appJsonObj = JSON.parse(appResponse)
            // Logger.log(appJsonObj)

            for (let key of appJsonObj.params["global-state"]) {

              if (key.key === "VFlVTA==") {
                // TYUL - Total Rewards Unlocked: Claimable YLDY from the prize game and staking pools.
                var appKeyTYULglobalUnlockRewards = parseFloat(Number(key.value.uint))
              }

              if (key.key === "R1NT") {
                // GSS - Global Staking Shares: Total amount of shares accumulated from all users inside the pool.
                var appKeyGSSglobalStakingShares = parseFloat(Number(key.value.uint))
              }

              if (key.key === "R0E=") {
                // GA - Global Amount: How much everyone in the pool has staked and withdrawn.
                var appKeyGAtotalStaked = parseFloat(Number(key.value.uint))
              }

              if (key.key === "R1Q=") {
                // GT - Global Time: Time since the user has either staked, withdrawn or claimed.
                var appKeyGTglobalTime = parseFloat(Number(key.value.uint))
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
            var yieldlyClaimableRewards = ((userKeyUSSuserStakingShares + ((appKeyGTglobalTime - userKeyUTuserTimeCurrentBlockTimestamp) / 86400) * userKeyUAuserAmount) / appKeyGSSglobalStakingShares) * appKeyTYULglobalUnlockRewards / denominator
            Logger.log("Yieldly claimable Rewards: " + yieldlyClaimableRewards)
            totalAmount += yieldlyClaimableRewards
          }
        } catch(err) {
          Logger.log("ERROR: Failed to parse amount for address: " + address)
        }

        Logger.log("Staking: " + stakedAmount)
        totalAmount += stakedAmount
      }
    }
    return totalAmount
  }
}

/**
 * Fetches balance(s) of staked Algorand asset (Algorand or Algorand Standard Asset (ASA)) on Yieldly.
 *
 * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses) where asset was staked.
 * @return {float} The total amount of ALGO stored in the wallet(s) and/or staking contract.
 */
function fetchAlgorandPlatformYieldlyPoolStakingBalance(appIds, denominator, assetId) {
  /**
   * Fetches balance(s) of Algorand asset (Algorand or Algorand Standard Asset (ASA)) from both public wallet address(es) and staking contracts.
   *
   * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
   * @return {float} The total amount of the cryptocurrency stored in the wallet(s) and/or staking contract.
   */
  return function(addresses) {

    var urlStakingPools = "https://app.yieldly.finance/staking/pools"
    var responseStakingPools = UrlFetchApp.fetch(urlStakingPools, {"muteHttpExceptions": true}).getContentText()
    // Logger.log(responseStakingPools)
    var jsonObjStakingPools = JSON.parse(responseStakingPools)
    // utilPrettyPrintJson(jsonObjStakingPools)

    var totalAmount = 0
    for (let address of addresses) {
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      if ("actions" in addressInfo && addressInfo["actions"].includes("staking")) {
        var url = "https://api.algoexplorer.io/v2/accounts/"+ address
        var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
        // Logger.log(response)
        var jsonObj = JSON.parse(response)
        // Logger.log(jsonObj)

        var stakedAmount = 0
        try {
          for (let appId of appIds) {
            var stakingTokenAssetId
            var rewardsTokensAssetIds
            for (let pool of jsonObjStakingPools) {
              let parsedPoolId = Number(pool["Id"]).toLocaleString("fullwide", {useGrouping: false})
              if (parsedPoolId === appId) {
                stakingTokenAssetId = Number(pool["StakingToken"]["TokenAssetId"]).toLocaleString("fullwide", {useGrouping: false})
                rewardsTokensAssetIds = pool["RewardToken"].map((value) => Number(value["TokenAssetId"]).toLocaleString("fullwide", {useGrouping: false}))
              }
            }
            if (appId === "233725850") {
              rewardsTokensAssetIds.push("algorand")
            }

            for (let app of jsonObj["apps-local-state"]) {
              let parsedAppId = Number(app["id"]).toLocaleString("fullwide", {useGrouping: false})
              if (parsedAppId === appId && rewardsTokensAssetIds.includes(assetId)) {
                for (let appKeyValue of app["key-value"]) {

                  if (appKeyValue.key === "VUE=") {
                    // USS - User Staking Shares: Each user’s personal staking shares in the pool (requires a full 24 hours passed to update).
                    var userKeyUSSuserStakingShares = parseFloat(Number(appKeyValue.value.uint))
                    // UA - User Amount: Net amount the user has staked and withdrawn.
                    var userKeyUAuserAmount = userKeyUSSuserStakingShares
                    var parsedAmount = userKeyUSSuserStakingShares / denominator
                    if (parsedAmount === undefined) {
                      throw new Error("Unable to parse value.")
                    } else {
                      if (assetId !== "algorand") {
                        stakedAmount += parsedAmount
                      }
                    }
                  }

                  if (appKeyValue.key === "VVQ=") {
                    // UT - User Time: Time since the user has either staked, withdrawn or claimed.
                    var userKeyUTuserTimeCurrentBlockTimestamp = parseFloat(Number(appKeyValue.value.uint))
                  }
                }

                var appUrl = "https://api.algoexplorer.io/v2/applications/" + appId
                var appResponse = UrlFetchApp.fetch(appUrl, {"muteHttpExceptions": true}).getContentText()
                // Logger.log(appResponse)
                var appJsonObj = JSON.parse(appResponse)
                // utilPrettyPrintJson(appJsonObj)

                for (let key of appJsonObj.params["global-state"]) {

                  if (key.key === "VFlVTA==") {
                    // TYUL - Total Rewards Unlocked: Claimable rewards from the staking pool.
                    var appKeyTYULprimaryGlobalUnlockRewards = parseFloat(Number(key.value.uint))
                  }

                  if (key.key === "R1NT") {
                    // GSS - Global Staking Shares: Total amount of shares accumulated from all users inside the pool.
                    var appKeyGSSglobalStakingShares = parseFloat(Number(key.value.uint))
                  }

                  if (key.key === "R0E=") {
                    // GA - Global Amount: How much everyone in the pool has staked and withdrawn.
                    var appKeyGAtotalStaked = parseFloat(Number(key.value.uint))
                  }

                  if (key.key === "R1Q=") {
                    // GT - Global Time: Time since the user has either staked, withdrawn or claimed.
                    var appKeyGTglobalTime = parseFloat(Number(key.value.uint))
                  }

                  if (key.key === "VEFQ") {
                    // Secondary TYUL - Total Secondary Rewards Unlocked: Claimable secondary rewards from the staking pool.
                    var appKeyTYULsecondaryGlobalUnlockRewards = parseFloat(Number(key.value.uint))
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
                var claimableRewards = ((userKeyUSSuserStakingShares + ((appKeyGTglobalTime - userKeyUTuserTimeCurrentBlockTimestamp) / 86400) * userKeyUAuserAmount) / appKeyGSSglobalStakingShares) * appKeyTYULglobalUnlockRewards / denominator
                Logger.log("Claimable Rewards: " + claimableRewards)
                totalAmount += claimableRewards
              }
            }
          }
        } catch(err) {
          Logger.log("ERROR: Failed to parse amount for address: " + address)
        }

        Logger.log("Staking: " + stakedAmount)
        totalAmount += stakedAmount
      }
    }
    return totalAmount
  }
}

/**
 * Fetches balance(s) of staked Algorand asset (Algorand or Algorand Standard Asset (ASA)) on AlgoFi.
 *
 * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses) where asset was staked.
 * @return {float} The total amount of DEFLY stored in the wallet(s) and/or staking contract.
 */
function fetchAlgorandPlatformAlgoFiStakingBalance(appIds, denominator, assetId) {
  /**
   * Fetches balance(s) of Algorand asset (Algorand or Algorand Standard Asset (ASA)) from both public wallet address(es) and staking contracts.
   *
   * @param {string} addresses - String of the public wallet address(es) (comma-delimited if there are multiple addresses).
   * @return {float} The total amount of the cryptocurrency stored in the wallet(s) and/or staking contract.
   */
  return function(addresses) {

    var totalAmount = 0
    for (let address of addresses) {
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      if ("actions" in addressInfo && addressInfo["actions"].includes("staking")) {
        var dynamicallyCreatedStakingAddress = addressInfo["actions"][addressInfo["actions"].indexOf("staking") + 1]
        var url = "https://indexer.algoexplorerapi.io/v2/accounts/" + dynamicallyCreatedStakingAddress + "?include-all=true"
        var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
        // Logger.log(response)
        var jsonObj = JSON.parse(response)
        // Logger.log(jsonObj)

        var stakedAmount = 0
        try {
          for (let appId of appIds) {
            for (let app of jsonObj.account["apps-local-state"]) {
              let parsedAppId = Number(app["id"]).toLocaleString("fullwide", {useGrouping: false})
              if (parsedAppId === appId) {
                for (let appKeyValue of app["key-value"]) {
                  if (appKeyValue.key === "dWFj") {
                    // USS - User Staking Shares: Each user’s personal staking shares in the pool (requires a full 24 hours passed to update).
                    var userKeyUSSuserStakingShares = parseFloat(Number(appKeyValue.value.uint))
                    // UA - User Amount: Net amount the user has staked and withdrawn.
                    var userKeyUAuserAmount = userKeyUSSuserStakingShares
                    var parsedAmount = userKeyUSSuserStakingShares / denominator
                    if (parsedAmount === undefined) {
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
                // // Logger.log(appResponse)
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
                // Logger.log("Claimable Rewards: " + claimableRewards)
                // totalAmount += claimableRewards
              }
            }
          }
        } catch(err) {
          Logger.log("ERROR: Failed to parse amount for address: " + address)
        }

        Logger.log("Staking: " + stakedAmount)
        totalAmount += stakedAmount
      }
    }
    return totalAmount
  }
}

/**
 * Fetches total balance of all Monero wallet send and receive transactions.
 *
 * @param {string} transactions - String of the wallet transactions separated by commas and formatted as txType:txId:txAddress:txKey/txSendAmount
 * @return {float} The total amount of the cryptocurrency stored in the wallet.
 */
function fetchMoneroBalance(transactions) {
  var totalAmount = 0
  for (let transaction of transactions) {
    let txComponents = transaction.split(":")
    let txType = txComponents[0]
    let txId = txComponents[1]
    let txAddress = txComponents[2]
    let txKey
    let txSendAmount
    let txSendFee

    let privateViewkey

    var url
    var amount = 0
    if (txType === "receive") {
      privateViewkey = txComponents[3]
      url = "https://xmrchain.net/api/outputs?txhash=" + txId + "&address=" + txAddress + "&viewkey=" + privateViewkey
      var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
      var jsonObj = JSON.parse(response)
      // Logger.log(jsonObj)

      for (let balance of jsonObj.data.outputs) {
        // Logger.log(balance)
        amount += parseFloat(Number(balance.amount)) / 1000000000000
      }
    } else if (txType === "send") {
      txSendAmount = Number(txComponents[3])
      if (isNaN(txSendAmount)) {
        txKey = txComponents[3]
        url = "https://xmrchain.net/api/outputs?txhash=" + txId + "&address=" + txAddress + "&viewkey=" + txKey + "&txprove=1"
        var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
        var jsonObj = JSON.parse(response)
        // Logger.log(jsonObj)

        for (let balance of jsonObj.data.outputs) {
          // Logger.log(balance)
          amount -= parseFloat(Number(balance.amount)) / 1000000000000
        }
      } else {
        amount -= txSendAmount
      }

      var url = "https://xmrchain.net/api/transaction/" + txId
      var response = UrlFetchApp.fetch(url, {"muteHttpExceptions": true}).getContentText()
      var jsonObj = JSON.parse(response)
      // Logger.log(jsonObj)

      txSendFee = parseFloat(Number(jsonObj.data.tx_fee)) / 1000000000000
      Logger.log("Send fee: " + txSendFee)
      amount -= txSendFee
    }

    Logger.log("Amount: " + amount)
    totalAmount += amount
  }
  return totalAmount
}

// export {CRYPTO_WALLET_TICKERS, CRYPTO_WALLET_BALANCE}
