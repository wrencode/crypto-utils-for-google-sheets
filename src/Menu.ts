
// noinspection JSUnusedGlobalSymbols
function onOpen(e: any) {
    let menu = SpreadsheetApp.getUi().createAddonMenu()
    if (e && e.authMode == ScriptApp.AuthMode.NONE) {
        // Add a normal menu item (works in all authorization modes).
        menu.addItem('Start workflow', 'startWorkflow')
    } else {
        // Add a menu item based on properties (doesn't work in AuthMode.NONE).
        const properties = PropertiesService.getDocumentProperties()
        const workflowStarted = properties.getProperty('workflowStarted')
        if (workflowStarted) {
            menu.addItem('Check workflow status', 'checkWorkflow')
        } else {
            menu.addItem('Start workflow', 'startWorkflow')
        }
    }
    menu.addToUi()
}

function startWorkflow() {
    SpreadsheetApp.getUi().alert("Workflow started!");
}

/**
 * Build a simple card with a button that sends a notification.
 * @return {Card}
 */
function homepageSidebar() {
    let homepageCard = CardService.newCardBuilder()
        .setHeader(
            CardService.newCardHeader()
                .setTitle('Crypto Utils')
                .setSubtitle('Cryptocurrency utilities for Google Sheets')
        )
        .addSection(
            CardService.newCardSection()
                .addWidget(
                    CardService.newTextButton()
                        .setText("Activate Crypto Utils!")
                        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
                        .setOnClickAction(
                            CardService.newAction()
                                .setFunctionName('activateCryptoUtils')
                                .setParameters({'notifyText': 'Crypto Utils activated!'})
                        )
                )
        )
    return homepageCard.build();
}

// noinspection JSValidateJSDoc
/**
 * Callback function for a button action. Constructs a
 * notification action response and returns it.
 * @param {Object} e the action event object
 * @return {ActionResponse}
 */
function activateCryptoUtils(e: any) {
    const parameters = e.parameters
    const notificationText = parameters['notifyText']

    return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification()
            .setText(notificationText) // @ts-ignore
            .setType(CardService.NotificationType.INFO))
        .build() // Don't forget to build the response!
}
