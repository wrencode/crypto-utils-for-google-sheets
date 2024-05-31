// noinspection DuplicatedCode

// import {utilParseCryptoAddresses, utilCleanAddress, utilGetResponseJsonFromRequest, utilGetCryptoAmountFromApi} from "../utils/CryptoWalletUtils"

// noinspection JSValidateJSDoc,JSUnusedGlobalSymbols
/**
 * Retrieve all supported cryptocurrencies of the CRYPTO_WALLET_BALANCE custom function.
 *
 * @param {boolean} doRefresh - Variable used to refresh function (can be any value that changes).
 *
 * @return {array} - An array of all cryptocurrency tickers supported by the CRYPTO_WALLET_BALANCE custom function.
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
 * Retrieve wallet balance(s) of the selected cryptocurrency asset.
 *
 * @param {string} cryptocurrencyTicker - Ticker of the selected cryptocurrency for which to retrieve wallet balance(s).
 * @param {string} walletAddresses - Comma-separated list of public wallet addresses as string (Ex.: "address1,address2").
 * @param {string} apiKey - Personal API key for Etherscan.io or for BscScan.com (depending on selected cryptocurrency).
 * @param {boolean} doRefresh - Variable used to refresh function (can be any value that changes).
 *
 * @return {float} - The total amount (sum of wallet balance(s)) of the selected cryptocurrency.
 *
 * @customfunction
 */
function CRYPTO_WALLET_BALANCE(cryptocurrencyTicker: string, walletAddresses: string, apiKey: string, doRefresh = true) {

  // @ts-ignore
  let addresses: Array<string> = utilParseCryptoAddresses(walletAddresses).filter(Boolean)
  console.log(addresses)

  const cryptoAssets = getCryptoWalletAssets() as {[key: string]: Array<Function>}

  cryptocurrencyTicker = cryptocurrencyTicker.toUpperCase()
  const randomDelay = Math.floor(Math.random() * 1000)
  Utilities.sleep(randomDelay)

  let amount
  if (cryptoAssets.hasOwnProperty(cryptocurrencyTicker)) {
    amount = cryptoAssets[cryptocurrencyTicker].reduce((prevFunc, currFunc) => {
      return () => {
        return prevFunc(addresses, apiKey) + currFunc(addresses, apiKey)
      }
    }, () => 0)()
    console.log(`Total amount of ${cryptocurrencyTicker.toUpperCase()}: ${amount.toPrecision()}`)
  } else {
    throw "Cryptocurrency " + cryptocurrencyTicker + " is not yet supported! " +
    "Call CRYPTO_WALLET_TICKERS to get an array of currently supported cryptocurrencies. " +
    "Please contact dev@wrencode.com to request support for additional crypto assets."
  }

  if (!isNaN(amount)){
    return amount
  } else {
    // RETURN for testing only
    // return amount
    throw "Retrieval of cryptocurrency " + cryptocurrencyTicker + " failed. " +
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
    "NEO": [fetchLegacyNeoPlatformBalance("c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b")],
    "GAS": [fetchLegacyNeoPlatformBalance("602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7")],
    "MCT": [fetchLegacyNeoPlatformBalance("a87cc2a513f5d8b4a42432343687c2127c60bc3f")],
    "TKY": [fetchLegacyNeoPlatformBalance("132947096727c84c7f9e076c90f08fec3bc17f18")],
    "DBC": [fetchLegacyNeoPlatformBalance("b951ecbbc5fe37a9c280a76cb0ce0014827294cf")],
    "ONT": [fetchLegacyNeoPlatformBalance("ceab719b8baa2310f232ee0d277c061704541cfb")],
    "IOTA": [fetchIotaBalance],
    "SMR": [fetchShimmerBalance, fetchShimmerEVMBalance],
    "ARK": [fetchArkBalance],
    "XNO": [fetchNanoBalance],
    "BAN": [fetchBananoBalance],
    "BTC": [fetchBitcoinBalance],
    "XMR": [fetchMoneroBalance],
    "BNB": [fetchBinanceCoinBalance],
    "ALGO": [fetchAlgorandBalance],
    "EXIT": [fetchAlgorandPlatformBalance("213345970", 100000000)],
    "YLDY": [fetchAlgorandPlatformBalance("226701642", 1000000)],
    "DEFLY": [fetchAlgorandPlatformBalance("470842789", 1000000)],
    "XLM": [fetchStellarLumensBalance]
  }
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of public ETH wallet(s).
 *
 * @param {Array<string>} addresses - Array of public wallet addresses.
 * @param {string} apiKey - Personal API key for Etherscan.io.
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchEthereumBalance(addresses: Array<string>, apiKey: string) {
  let totalAmount = 0
  for (let address of addresses) {
    // @ts-ignore
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    const url = "https://api.etherscan.io/api?module=account&action=balance&address=" + address + "&tag=latest&apikey=" + apiKey

    // @ts-ignore
    let amount = utilGetCryptoAmountFromApi(url, address, "result", 1000000000000000000)

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
   * @param {Array<string>} addresses - Array of public wallet addresses.
   * @param {string} apiKey - Personal API key for Etherscan.io.
   *
   * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
   */
  return function(addresses: Array<string>, apiKey: string) {
    let totalAmount = 0
    for (let address of addresses) {
      // @ts-ignore
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      const url = "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress="+ contractAddress + "&address="+ address + "&tag=latest&apikey=" + apiKey

      // @ts-ignore
      let amount = utilGetCryptoAmountFromApi(url, address, "result", denominator)

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
   * @param {Array<string>} addresses - Array of public wallet addresses.
   * @param {string} apiKey - Personal API key for Etherscan.io.
   *
   * @return {number} The total amount of the cryptocurrency stored in the wallet(s) and/or staking contract.
   */
  return function(addresses: Array<string>, apiKey: string) {
    let totalAmount = 0
    // let validatorCount = 0
    for (let address of addresses) {
      // @ts-ignore
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      if ("actions" in addressInfo && addressInfo["actions"].includes("staking")) {
        const url = "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress="+ contractAddress + "&address="+ address + "&tag=latest&apikey=" + apiKey

        // @ts-ignore
        let stakedAmount = utilGetCryptoAmountFromApi(url, address, "result", denominator)

        console.log("STAKED: " + stakedAmount)
        totalAmount += stakedAmount
      }

      // // for unclaimed MATIC (from unbonding with a validator) still awaiting Polygon network checkpoints
      // if (contractAddress === "0xafe97c48b465d424d25ae3a52a722f4496ceb6e3" && validatorCount === 0) {
      //   // sentinel.matic.network API has been deprecated
      //   const url = "https://sentinel.matic.network/api/v2/delegators/" + address + "?limit=100&offset=0&sortBy=stake&direction=DESC&type=staked"
      //
      //   // @ts-ignore
      //   const responseJson = utilGetResponseJsonFromRequest(url)
      //
      //   let unclaimedAmount = 0
      //   for (let validator of responseJson.result) {
      //     // noinspection JSUnresolvedVariable
      //     unclaimedAmount += parseFloat(validator.unclaimedAmount) / denominator
      //     validatorCount += 1
      //   }
      //   console.log("UNCLAIMED: " + unclaimedAmount)
      //   totalAmount += unclaimedAmount
      // }
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
function fetchLegacyNeoPlatformBalance(assetHash: string) {
  /**
   * Fetches balance(s) of public NEO/GAS/NEP-5 wallet(s).
   *
   * @param {Array<string>} addresses - Array of public wallet addresses.
   *
   * @return {float} The total amount of the cryptocurrency stored in the wallet(s).
   */
  return function(addresses: Array<string>) {
    let totalAmount = 0
    for (let address of addresses) {
      // @ts-ignore
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      let url = "https://dora.coz.io/api/v1/neo2/mainnet/get_balance/" + address

      // @ts-ignore
      let responseJson = utilGetResponseJsonFromRequest(url)

      let amount = 0
      // noinspection JSUnresolvedVariable
      for (let asset of responseJson.balance) {
        // noinspection JSUnresolvedVariable
        if (asset.asset_hash === assetHash) {
          amount += Number(asset.amount)
          // console.log("Amount: " + amount)
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
 * @param {Array<string>} addresses - Array of public wallet addresses.
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet.
 */
function fetchIotaBalance(addresses: Array<string>) {
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
    const url = "https://explorer-api.iota.org/stardust/balance/chronicle/mainnet/" + address;

    // @ts-ignore
    let amount = utilGetCryptoAmountFromApi(url, address, "totalBalance", 1000000);

    console.log("Amount: " + amount)
    totalAmount += amount
  }

  return totalAmount
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance of all public SMR wallet receive addresses.
 *
 * @param {Array<string>} addresses - Array of public wallet addresses.
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet.
 */
function fetchShimmerBalance(addresses: Array<string>) {
  addresses = addresses.filter((address: string) => address.startsWith("smr"))
  console.log("Fetching SMR amounts for " + addresses.length + " addresses.")

  let totalAmount = 0
  for (let address of addresses) {
    // @ts-ignore
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]
    if ("actions" in addressInfo) {
      let addressActions = addressInfo["actions"]
      console.log("Fetching SMR balance for: " + address + " (with action" + ((addressActions.length > 1) ? "s" : "") + ": " + addressActions.join(", ") + ")")
    }
    else {
      console.log("Fetching SMR balance for: " + address)
    }
    const url = "https://explorer-api.iota.org/stardust/balance/chronicle/shimmer/" + address;
    // const url = "https://explorer-api.shimmer.network/stardust/balance/chronicle/shimmer/" + address;

    let amount
    try {
      // @ts-ignore
      amount = utilGetCryptoAmountFromApi(url, address, "totalBalance", 1000000)
    } catch (err) {
      // the SMR explorer API does not return any JSON if the address has no balance/activity
      if (err instanceof SyntaxError && err.message.includes("Unexpected end of JSON input")) {
        console.warn("SMR explorer API did not return valid JSON. Setting SMR amount to 0.")
        amount = 0
      } else {
        throw err
      }
    }

    // set amount to zero if it is NaN
    if (Number.isNaN(amount)) {
      amount = 0
    }

    console.log("Amount: " + amount)
    totalAmount += amount
  }
  return totalAmount
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance of all public SMR EVM wallet receive addresses.
 *
 * @param {Array<string>} addresses - Array of public wallet addresses.
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet.
 */
function fetchShimmerEVMBalance(addresses: Array<string>) {
  addresses = addresses.filter((address: string) => !address.startsWith("smr"))
  console.log("Fetching SMR EVM amounts for " + addresses.length + " addresses.")

  let totalAmount = 0
  for (let address of addresses) {
    console.log("Fetching SMR EVM balance for: " + address)

    const url = "https://explorer.evm.shimmer.network/api/v2/addresses/" + address
    // @ts-ignore
    let amount = utilGetCryptoAmountFromApi(url, address, "coin_balance", 1000000000000000000)
    // @ts-ignore
    const value = amount * utilGetResponseJsonFromRequest(url)["exchange_rate"]

    // set amount to zero if it is NaN
    if (Number.isNaN(amount) || value < 0.01) {
      amount = 0
    }

    console.log("Amount: " + amount)
    totalAmount += amount
  }
  return totalAmount
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of public NANO wallet(s).
 *
 * @param {Array<string>} addresses - Array of public wallet addresses.
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchNanoBalance(addresses: Array<string>) {
  let totalAmount = 0
  for (let address of addresses) {

    // @ts-ignore
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    const url = "https://api.nanoblockexplorer.com/v2/accounts/" + address

    // @ts-ignore
    const responseJson = utilGetResponseJsonFromRequest(url)

    // noinspection JSUnresolvedVariable
    let amount = Number(parseFloat(responseJson.account.balance).toFixed(30)) / 1000000000000000000000000000000
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
 * @param {Array<string>} addresses - Array of public wallet addresses.
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchBananoBalance(addresses: Array<string>) {
  let totalAmount = 0
  for (let address of addresses) {
    // @ts-ignore
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    const url = "https://api.spyglass.pw/banano/v1/account/overview/" + address

    // @ts-ignore
    let amount = utilGetCryptoAmountFromApi(url, address, "balance", 100000000000000000000000000000)

    console.log("Amount: " + amount)
    totalAmount += amount
  }
  return totalAmount
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of public ARK wallet(s).
 *
 * @param {Array<string>} addresses - Array of public wallet addresses.
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchArkBalance(addresses: Array<string>) {
  let totalAmount = 0
  for (let address of addresses) {
    // @ts-ignore
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    const url = "https://explorer.ark.io/api/wallets/" + address
    // @ts-ignore
    let amount = utilGetCryptoAmountFromApi(url, address, "data.balance", 100000000)

    console.log("Amount: " + amount)
    totalAmount += amount
  }
  return totalAmount
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of public BTC/LTC/DASH/DOGE wallet(s).
 *
 * @param {Array<string>} addresses - Array of public wallet addresses.
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchBitcoinBalance(addresses: Array<string>) {
  let totalAmount = 0
  for (let address of addresses) {
    // @ts-ignore
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    const url = "https://blockstream.info/api/address/" + address

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
 * @param {Array<string>} addresses - Array of public wallet addresses.
 * @param {string} apiKey - Personal API key for BscScan.com.
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchBinanceCoinBalance(addresses: Array<string>, apiKey: string) {
  let totalAmount = 0
  for (let address of addresses) {
    // @ts-ignore
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]
    const url = "https://api.bscscan.com/api?module=account&action=balance&address=" + address + "&tag=latest&apikey=" + apiKey
    // @ts-ignore
    let amount = utilGetCryptoAmountFromApi(url, address, "result", 1000000000000000000)
    console.log("Amount: " + amount)
    totalAmount += amount
  }
  return totalAmount
}

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of public Algorand (ALGO) wallet(s).
 *
 * @param {Array<string>} addresses - Array of public wallet addresses.
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchAlgorandBalance(addresses: Array<string>) {
  let totalAmount = 0
  for (let address of addresses) {
    // @ts-ignore
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]

    const url = "https://mainnet-api.algonode.cloud/v2/accounts/" + address + "?include-all=true"

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
   * @param {Array<string>} addresses - Array of public wallet addresses.
   *
   * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
   */
  return function(addresses: Array<string>) {
    let totalAmount = 0
    for (let address of addresses) {
      // @ts-ignore
      let addressInfo = utilCleanAddress(address)
      address = addressInfo["address"]

      const url = "https://mainnet-api.algonode.cloud/v2/accounts/" + address + "?include-all=true"
2
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

// noinspection JSValidateJSDoc
/**
 * Fetches balance(s) of public Stellar Lumens (XLM) wallet(s).
 *
 * @param {Array<string>} addresses - Array of public wallet addresses.
 *
 * @return {number} The total amount of the cryptocurrency stored in the wallet(s).
 */
function fetchStellarLumensBalance(addresses: Array<string>) {
  let totalAmount = 0
  for (let address of addresses) {
    // @ts-ignore
    let addressInfo = utilCleanAddress(address)
    address = addressInfo["address"]
    const url = "https://horizon.stellar.org/accounts/" + address
    // @ts-ignore
    const responseJson = utilGetResponseJsonFromRequest(url)
    let amount = 0
    for (let balance of responseJson.balances) {
      // console.log(balance)
      if (balance.asset_type === "native") {
        // noinspection PointlessArithmeticExpressionJS
        amount += parseFloat(String(Number(balance.balance))) / 1.0
      }
    }
    console.log("Amount: " + amount)
    totalAmount += amount
  }
  return totalAmount
}

export {CRYPTO_WALLET_TICKERS, CRYPTO_WALLET_BALANCE}
