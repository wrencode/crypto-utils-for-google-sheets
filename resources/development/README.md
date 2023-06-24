# Development

## Install Dependencies

```shell
yarn install
```

## Compile TypeScript

```shell
node_modules/typescript/bin/tsc -p .
```

## Update Project Version

Increment version number in the following files:
* `package.json`
* `src/Menu.ts`

## Login & Push With Clasp

#### Login

```shell
clasp login
```

Make sure that the *path* to the project directory is correct in the `rootDir` value in `.clasp.json`. 

#### Push

```shell
clasp push
```

***Note***: Clasp is meant to also support *local* login with `clasp login --creds creds.json`, but there seem to be issues preventing that from working properly.

## Deploy New Google Apps Script Version

* Navigate to the project in Google Apps Script
* Click the `Deploy` button, then click `New deployment`
  * Fill out the `Description` field with `vX.X.X` and hit `Deploy`.
  * Copy the `Deployment ID` value.
* Navigate to the project in Google Cloud
* Update the deployment
  * Select `Enabled APIs and services`
  * Select `Google Workspace Marketplace SDK`
  * Select the `APP CONFIGURATION` tab
  * Paste the `Deployment ID` value copied from the new deployment into the respective field.
  * Increment the `Sheets Add-on script version` value by 1.
  * Hit `SAVE` at the bottom of the page.
* Refresh the Google Sheet using the app, then check the app menu item to make sure the latest version has been deployed. 
