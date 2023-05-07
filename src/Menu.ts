
// noinspection JSUnusedGlobalSymbols
// @ts-ignore
function onOpen(e: any) {
    let menu = SpreadsheetApp.getUi().createAddonMenu()
    if (e && e.authMode == ScriptApp.AuthMode.NONE) {
        // Add a normal menu item (works in all authorization modes).
        menu.addItem("Crypto Utils Setup Hint", "cryptoUtilsInstructions")
    } else {
        // Add a menu item based on properties (doesn't work in AuthMode.NONE).
        const properties = PropertiesService.getDocumentProperties()
        const isActivated = properties.getProperty("isActivated")
        if (isActivated) {
            menu.addItem("Crypto Utils Version", "getCryptoUtilsVersion")
        } else {
            menu.addItem("Activate Crypto Utils", "activateCryptoUtils")
        }
    }
    menu.addToUi()
}

function cryptoUtilsInstructions() {
    SpreadsheetApp.getUi().alert("You must give Crypto Utils the correct permissions before it can be activated.")
}

function activateCryptoUtils() {
    const properties = PropertiesService.getDocumentProperties()
    properties.setProperty("isActivated", "true")
    SpreadsheetApp.getUi().alert("Crypto Utils has been activated!")
}

function getCryptoUtilsVersion() {
    SpreadsheetApp.getUi().alert("Currently using Crypto Utils v7.2.0")
}

// noinspection JSUnusedGlobalSymbols
/**
 * Build a simple card with a button that sends a notification.
 * @return {Card}
 */
function homepageSidebar() {
    let homepageCard = CardService.newCardBuilder()
        .setHeader(
            CardService.newCardHeader()
                .setTitle("Custom Functions")
                .setSubtitle("Available custom functions for Google Sheets.")
        )
        .addSection(
            CardService.newCardSection()
                .setHeader(
                    "CRYPTO_PRICE\n" +
                    "Retrieve current price of the selected cryptocurrency and return the value of the input cryptocurrency in the output cryptocurrency/fiat currency."
                )
                .setCollapsible(true)
                .addWidget(
                    CardService.newTextParagraph().setText("{string} currencyTickerIn")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Ticker of input cryptocurrency for which the price is to be retrieved.")
                )
                .addWidget(
                    CardService.newDivider()
                )
                .addWidget(
                    CardService.newTextParagraph().setText("{string} currencyTickerOut")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Ticker of output cryptocurrency/fiat currency in which to represent the price of the input cryptocurrency.")
                )
                .addWidget(
                    CardService.newDivider()
                )
                .addWidget(
                    CardService.newTextParagraph().setText("{string} apiKey")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Personal API key for CryptoCompare.com.")
                )
                .addWidget(
                    CardService.newDivider()
                )
                .addWidget(
                    CardService.newTextParagraph().setText("(OPTIONAL) {number} timestamp")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("The UNIX timestamp of the desired date for which to retrieve the price of the input cryptocurrency.")
                )
                .addWidget(
                    CardService.newDivider()
                )
                .addWidget(
                    CardService.newTextParagraph().setText("(OPTIONAL) {boolean} doRefresh")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Variable used to refresh function (can be any value that changes).")
                )
        )
        .addSection(
            CardService.newCardSection()
                .setHeader(
                    "CRYPTO_PRICE_ON_DATE\n" +
                    "Retrieve average price of the selected cryptocurrency on a specified date and return the value of the input cryptocurrency in the output cryptocurrency/fiat currency on the specified date."
                )
                .setCollapsible(true)
                .addWidget(
                    CardService.newTextParagraph().setText("{string} currencyTickerIn")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Ticker of input cryptocurrency for which the price is to be retrieved.")
                )
                .addWidget(
                    CardService.newDivider()
                )
                .addWidget(
                    CardService.newTextParagraph().setText("{string} currencyTickerOut")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Ticker of output cryptocurrency/fiat currency in which to represent the price of the input cryptocurrency.")
                )
                .addWidget(
                    CardService.newDivider()
                )
                .addWidget(
                    CardService.newTextParagraph().setText("{string} apiKey")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("API key for cryptocompare.com.")
                )
                .addWidget(
                    CardService.newDivider()
                )
                .addWidget(
                    CardService.newTextParagraph().setText("{number} timestamp")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("The UNIX timestamp of the desired date for which to retrieve the price of the input cryptocurrency.")
                )
                .addWidget(
                    CardService.newDivider()
                )
                .addWidget(
                    CardService.newTextParagraph().setText("(OPTIONAL) {boolean} doRefresh")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Variable used to refresh function (can be any value that changes).")
                )
        )
        .addSection(
            CardService.newCardSection()
                .setHeader(
                    "CRYPTO_NAME\n" +
                    "Retrieve full name of the selected cryptocurrency ticker and return the full name of said cryptocurrency ticker."
                )
                .setCollapsible(true)
                .addWidget(
                    CardService.newTextParagraph().setText("{string} cryptocurrencyTicker")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Ticker of input cryptocurrency for which to retrieve the full name.")
                )
                .addWidget(
                    CardService.newDivider()
                )
                .addWidget(
                    CardService.newTextParagraph().setText("(OPTIONAL) {boolean} doRefresh")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Variable used to refresh function (can be any value that changes).")
                )
        )
        .addSection(
            CardService.newCardSection()
                .setHeader(
                    "CRYPTO_TYPE\n" +
                    "Retrieve summarized type of the selected cryptocurrency ticker (where available) and return the summarized type, consensus mechanism, and platform (where applicable and available) of said cryptocurrency ticker."
                )
                .setCollapsible(true)
                .addWidget(
                    CardService.newTextParagraph().setText("{string} cryptocurrencyTicker")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Ticker of input cryptocurrency for which to retrieve the summarized type.")
                )
                .addWidget(
                    CardService.newDivider()
                )
                .addWidget(
                    CardService.newTextParagraph().setText("(OPTIONAL) {boolean} doRefresh")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Variable used to refresh function (can be any value that changes).")
                )
        )
        .addSection(
            CardService.newCardSection()
                .setHeader(
                    "CRYPTO_WALLET_TICKERS\n" +
                    "Retrieve all supported cryptocurrencies of the CRYPTO_WALLET_BALANCE custom function and return an array of said supported cryptocurrency tickers."
                )
                .setCollapsible(true)
                .addWidget(
                    CardService.newTextParagraph().setText("(OPTIONAL) {boolean} doRefresh")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Variable used to refresh function (can be any value that changes).")
                )
        )
        .addSection(
            CardService.newCardSection()
                .setHeader(
                    "CRYPTO_WALLET_BALANCE\n" +
                    "Retrieve wallet balance(s) of the selected cryptocurrency asset and return the total amount (sum of wallet balance(s)) of said cryptocurrency."
                )
                .setCollapsible(true)
                .addWidget(
                    CardService.newTextParagraph().setText("{string} cryptocurrencyTicker")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Ticker of the selected cryptocurrency for which to retrieve wallet balance(s).")
                )
                .addWidget(
                    CardService.newDivider()
                )
                .addWidget(
                    CardService.newTextParagraph().setText("{string} walletAddresses")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Comma-separated list of public wallet addresses as string (Ex.: \"address1,address2\").")
                )
                .addWidget(
                    CardService.newDivider()
                )
                .addWidget(
                    CardService.newTextParagraph().setText("{string} apiKey")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Personal API key for Etherscan.io or for BscScan.com (depending on selected cryptocurrency).")
                )
                .addWidget(
                    CardService.newDivider()
                )
                .addWidget(
                    CardService.newTextParagraph().setText("(OPTIONAL) {boolean} doRefresh")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Variable used to refresh function (can be any value that changes).")
                )
        )
        .addSection(
            CardService.newCardSection()
                .setHeader(
                    "CRYPTO_EXCHANGES\n" +
                    "Retrieve all supported exchanges of the CRYPTO_EXCHANGE_BALANCE custom function and return an array of said supported exchanges."
                )
                .setCollapsible(true)
                .addWidget(
                    CardService.newTextParagraph().setText("{string} exchangesApiCredentials")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Comma-separated list of exchange API credentials as string, formatted as name:key:secret or name:key:secret:passphrase (Ex.: \"name:key:secret,name:key:secret:passphrase\").")
                )
                .addWidget(
                    CardService.newDivider()
                )
                .addWidget(
                    CardService.newTextParagraph().setText("(OPTIONAL) {boolean} doRefresh")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Variable used to refresh function (can be any value that changes).")
                )
        )
        .addSection(
            CardService.newCardSection()
                .setHeader(
                    "CRYPTO_EXCHANGE_BALANCE\n" +
                    "Retrieve cryptocurrency exchange balance(s) of the selected cryptocurrency asset and return the total amount (sum of exchange balance(s)) of the selected cryptocurrency stored across selected exchanges."
                )
                .setCollapsible(true)
                .addWidget(
                    CardService.newTextParagraph().setText("{string} cryptocurrencyTicker")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Ticker of the selected cryptocurrency for which to retrieve wallet balance(s).")
                )
                .addWidget(
                    CardService.newDivider()
                )
                .addWidget(
                    CardService.newTextParagraph().setText("{string} exchanges")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Comma-separated list of exchanges as string (Ex.: \"coinbase,binance-us\").")
                )
                .addWidget(
                    CardService.newDivider()
                )
                .addWidget(
                    CardService.newTextParagraph().setText("{string} exchangesApiCredentials")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Comma-separated list of exchange API credentials as string, formatted as name:key:secret or name:key:secret:passphrase (Ex.: \"name:key:secret,name:key:secret:passphrase\").")
                )
                .addWidget(
                    CardService.newDivider()
                )
                .addWidget(
                    CardService.newTextParagraph().setText("(OPTIONAL) {boolean} doRefresh")
                )
                .addWidget(
                    CardService.newTextParagraph().setText("Variable used to refresh function (can be any value that changes).")
                )
        )
    return homepageCard.build();
}
