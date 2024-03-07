// import { CRYPTO_WALLET_TICKERS, CRYPTO_WALLET_BALANCE } from "../crypto/CryptoWallet"

// noinspection JSUnusedGlobalSymbols
/**
 * Test CRYPTO_WALLET_TICKERS function.
 */
function testCryptoWalletTickers() {
  // @ts-ignore
  CRYPTO_WALLET_TICKERS(true)
}

// noinspection JSUnusedGlobalSymbols
/**
 * Test CRYPTO_WALLET_BALANCE function.
 */
function testCryptoWalletBalance() {

  let apiKey = ""
  let cryptocurrency
  let walletAddresses = ""

  let etherscanApiKey = ""
  try {
    etherscanApiKey = PropertiesService.getScriptProperties().getProperty("ETHERSCAN_API_KEY") || ""
  } catch (e) {
    if (e instanceof ReferenceError) {
      etherscanApiKey = process.env.ETHERSCAN_API_KEY || ""
    }
  }
  let bscscanApiKey = ""
  try {
    // noinspection JSUnusedAssignment
    bscscanApiKey = PropertiesService.getScriptProperties().getProperty("BSCSCAN_API_KEY") || ""
  } catch (e) {
    if (e instanceof ReferenceError) {
      // noinspection JSUnusedAssignment
      bscscanApiKey = process.env.BSCSCAN_API_KEY || ""
    }
  }

  cryptocurrency = "ETH"
  try {
    apiKey = etherscanApiKey
    walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_ETH_1") || ""
  } catch (e) {
    if (e instanceof ReferenceError) {
      apiKey = etherscanApiKey
      walletAddresses = process.env.WALLET_ADDRESSES_FOR_ETH_1 || ""
    }
  }

  // cryptocurrency = "IOTA"
  // try {
  //   walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_IOTA_1") || ""
  //   // walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_IOTA_2") || ""
  // } catch (e) {
  //   if (e instanceof ReferenceError) {
  //     walletAddresses = process.env.WALLET_ADDRESSES_FOR_IOTA_1 || ""
  //     // walletAddresses = process.env.WALLET_ADDRESSES_FOR_IOTA_2 || ""
  //   }
  // }

  // cryptocurrency = "SMR"
  // try {
  //   walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_SMR_1") || ""
  // } catch (e) {
  //   if (e instanceof ReferenceError) {
  //     walletAddresses = process.env.WALLET_ADDRESSES_FOR_SMR_1 || ""
  //   }
  // }

  // cryptocurrency = "XNO"
  // try {
  //   walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_NANO_1") || ""
  // } catch (e) {
  //   if (e instanceof ReferenceError) {
  //     walletAddresses = process.env.WALLET_ADDRESSES_FOR_NANO_1 || ""
  //   }
  // }

  // cryptocurrency = "BAN"
  // try {
  //   walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_BAN_1") || ""
  // } catch (e) {
  //   if (e instanceof ReferenceError) {
  //     walletAddresses = process.env.WALLET_ADDRESSES_FOR_BAN_1 || ""
  //   }
  // }

  // cryptocurrency = "NEO"
  // cryptocurrency = "GAS"
  // cryptocurrency = "DBC"
  // cryptocurrency = "TKY"
  // cryptocurrency = "MCT"
  // cryptocurrency = "ONT"
  // try {
  //   walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_NEO_PLATFORM_1") || ""
  //   // walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_NEO_PLATFORM_2") || ""
  // } catch (e) {
  //   if (e instanceof ReferenceError) {
  //     walletAddresses = process.env.WALLET_ADDRESSES_FOR_NEO_PLATFORM_1 || ""
  //     // walletAddresses = process.env.WALLET_ADDRESSES_FOR_NEO_PLATFORM_2 || ""
  //   }
  // }

  // cryptocurrency = "KCS"
  // try {
  //   apiKey = etherscanApiKey
  //   walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_KCS_1") || ""
  // } catch (e) {
  //   if (e instanceof ReferenceError) {
  //     apiKey = etherscanApiKey
  //     walletAddresses = process.env.WALLET_ADDRESSES_FOR_KCS_1 || ""
  //   }
  // }

  // cryptocurrency = "MATIC"
  // try {
  //   apiKey = etherscanApiKey
  //   walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_MATIC_1") || ""
  // } catch (e) {
  //   if (e instanceof ReferenceError) {
  //     apiKey = etherscanApiKey
  //     walletAddresses = process.env.WALLET_ADDRESSES_FOR_MATIC_1 || ""
  //   }
  // }

  // cryptocurrency = "BTC"
  // try {
  //   walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_BTC_1") || ""
  // } catch (e) {
  //   if (e instanceof ReferenceError) {
  //     walletAddresses = process.env.WALLET_ADDRESSES_FOR_BTC_1 || ""
  //   }
  // }

  // cryptocurrency = "ALGO"
  // cryptocurrency = "PLANET"
  // cryptocurrency = "EXIT"
  // cryptocurrency = "YLDY"
  // cryptocurrency = "DEFLY"
  // try {
  //   walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_ALGO_PLATFORM_1") || ""
  //   // walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_ALGO_PLATFORM_2") || ""
  //   // walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_ALGO_PLATFORM_3") || ""
  //   // walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_ALGO_PLATFORM_4") || ""
  //   // walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_ALGO_PLATFORM_5") || ""
  //   // walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_ALGO_PLATFORM_6") || ""
  // } catch (e) {
  //   if (e instanceof ReferenceError) {
  //     walletAddresses = process.env.WALLET_ADDRESSES_FOR_ALGO_PLATFORM_1 || ""
  //     // walletAddresses = process.env.WALLET_ADDRESSES_FOR_ALGO_PLATFORM_2 || ""
  //     // walletAddresses = process.env.WALLET_ADDRESSES_FOR_ALGO_PLATFORM_3 || ""
  //     // walletAddresses = process.env.WALLET_ADDRESSES_FOR_ALGO_PLATFORM_4 || ""
  //     // walletAddresses = process.env.WALLET_ADDRESSES_FOR_ALGO_PLATFORM_5 || ""
  //     // walletAddresses = process.env.WALLET_ADDRESSES_FOR_ALGO_PLATFORM_6 || ""
  //   }
  // }

  // cryptocurrency = "XMR"
  // try {
  //   walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_XMR_1") || ""
  // } catch (e) {
  //   if (e instanceof ReferenceError) {
  //     walletAddresses = process.env.WALLET_ADDRESSES_FOR_XMR_1 || ""
  //   }
  // }

  // cryptocurrency = "BNB"
  // try {
  //   apiKey = bscscanApiKey
  //   walletAddresses = PropertiesService.getScriptProperties().getProperty("WALLET_ADDRESSES_FOR_BNB_1") || ""
  // } catch (e) {
  //   if (e instanceof ReferenceError) {
  //     apiKey = bscscanApiKey
  //     walletAddresses = process.env.WALLET_ADDRESSES_FOR_BNB_1 || ""
  //   }
  // }

  // @ts-ignore
  CRYPTO_WALLET_BALANCE(cryptocurrency, walletAddresses, apiKey)
}

// testCryptoWalletTickers()
// testCryptoWalletBalance()

export {testCryptoWalletTickers, testCryptoWalletBalance}
