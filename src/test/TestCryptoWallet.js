// import { CRYPTO_WALLET_TICKERS, CRYPTO_WALLET_BALANCE } from "../crypto/CryptoWallet.js"

/**
 * Test CRYPTO_WALLET_TICKERS function.
 */
function testCryptoWalletTickers() {
  CRYPTO_WALLET_TICKERS(true)
}

/**
 * Test CRYPTO_WALLET_BALANCE function.
 */
function testCryptoWalletBalance() {

  // let apiKey = ""
  // let apiKey = process.env.ETHERSCAN_API_KEY
  let apiKey = PropertiesService.getScriptProperties().getProperty("ETHERSCAN_API_KEY")

  // apiKey = process.env.BSCSCAN_API_KEY

  let cryptocurrency = "ETH"
  // let walletAddresses = process.env.ETH_WALLET_ADDRESSES_1
  let walletAddresses = PropertiesService.getScriptProperties().getProperty("ETH_WALLET_ADDRESSES_1")


  // let cryptocurrency = "IOTA"
  // let walletAddresses = process.env.IOTA_WALLET_ADDRESSES_1
  // let walletAddresses = process.env.IOTA_WALLET_ADDRESSES_2

  // let cryptocurrency = "NANO"
  // let walletAddresses = process.env.NANO_WALLET_ADDRESSES_1

  // let cryptocurrency = "BAN"
  // let walletAddresses = process.env.BAN_WALLET_ADDRESSES_1

  // let cryptocurrency = "NEO"
  // let cryptocurrency = "GAS"
  // let walletAddresses = process.env.NEO_PLATFORM_WALLET_ADDRESSES_1
  // let walletAddresses = process.env.NEO_PLATFORM_WALLET_ADDRESSES_2

  // let cryptocurrency = "KCS"
  // let walletAddresses = process.env.KCS_WALLET_ADDRESSES_1

  // let cryptocurrency = "MATIC"
  // let walletAddresses = process.env.MATIC_WALLET_ADDRESSES_1

  // let cryptocurrency = "BTC"
  // let walletAddresses = process.env.BTC_WALLET_ADDRESSES_1

  // let cryptocurrency = "ALGO"
  // let cryptocurrency = "PLANET"
  // let cryptocurrency = "EXIT"
  // let cryptocurrency = "YLDY"
  // let cryptocurrency = "DEFLY"
  // let walletAddresses = process.env.ALGO_PLATFORM_WALLET_ADDRESSES_1
  // let walletAddresses = process.env.ALGO_PLATFORM_WALLET_ADDRESSES_2
  // let walletAddresses = process.env.ALGO_PLATFORM_WALLET_ADDRESSES_3
  // let walletAddresses = process.env.ALGO_PLATFORM_WALLET_ADDRESSES_4
  // let walletAddresses = process.env.ALGO_PLATFORM_WALLET_ADDRESSES_5
  // let walletAddresses = process.env.ALGO_PLATFORM_WALLET_ADDRESSES_6

  // let cryptocurrency = "XMR"
  // let walletAddresses = process.env.XMR_WALLET_ADDRESSES_1

  // let cryptocurrency = "TZROP"
  // let walletAddresses = process.env.TZROP_WALLET_ADDRESSES_1
  // let walletAddresses = process.env.TZROP_WALLET_ADDRESSES_2

  // let cryptocurrency = "BNB"
  // let walletAddresses = process.env.BNB_WALLET_ADDRESSES_1

  CRYPTO_WALLET_BALANCE(cryptocurrency, walletAddresses, apiKey)
}
