# [App] Ecoleta
[![react-native](https://img.shields.io/badge/react--native-0.61.4-61dafb?style=flat-square&logo=react)](https://reactnative.dev/)
[![styled-components](https://img.shields.io/badge/styled_components-5.1.1-db7b86?style=flat-square&logo=styled-components)](https://styled-components.com/)
[![eslint](https://img.shields.io/badge/eslint-6.8.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![expo](https://img.shields.io/badge/expo-37.0.3-000000?style=flat-square&logo=expo)](https://expo.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
This app version allow everyone to see all collect points near of you or other locations. All the resources used by this application comes from its [`API`](https://github.com/DiegoVictor/ecoleta-api).

## Table of Contents
* [Screenshots](#screenshots)
* [Installing](#installing)
  * [Configuring](#configuring)
    * [app.json](#appjson)
    * [API](#api)
* [Usage](#usage)
  * [Expo](#expo)
  * [OS](#os)

# Screenshots
Click to expand.<br>
<img src="https://raw.githubusercontent.com/DiegoVictor/ecoleta-app/master/screenshots/home.jpg" width="32%">
<img src="https://raw.githubusercontent.com/DiegoVictor/ecoleta-app/master/screenshots/points.jpg" width="32%">
<img src="https://raw.githubusercontent.com/DiegoVictor/ecoleta-app/master/screenshots/detail.jpg" width="32%">

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
Configure your environment variables and remember to start the [API](https://github.com/DiegoVictor/ecoleta-api) before to start this app.

### app.json
In this file you may configure the API's url. Rename the `app.example.json` in the root directory to `app.json` then update with your settings **only the keys under `extra` key**.

key|description|default
---|---|---
API_URL|API's url with version (v1)|`http://localhost:3333/v1`

### API
Start the [`API`](https://github.com/DiegoVictor/ecoleta-api) (see its README for more information). In case of any change in the API's `port` or `host` remember to update the `app.json`'s `API_URL` property too.
> Also, maybe you need run reverse command to the API's port: `adb reverse tcp:3333 tcp:3333` or use the `expo` host (e.g. `192.168.0.9`)

# Usage
To start the app run:
```
$ yarn start
```
Or:
```
$ npm run start
```
> This project was built with [Expo](https://expo.io), to know how to run it in your phone see [Expo client for iOS and Android](https://docs.expo.io/versions/v37.0.0/get-started/installation/#2-mobile-app-expo-client-for-ios) and in your computer see [Running the Expo client on your computer](https://docs.expo.io/versions/v37.0.0/get-started/installation/#running-the-expo-client-on-your-computer).

## OS
This app was tested only with Android through USB connection and [Genymotion](https://www.genymotion.com/) (Emulator), is strongly recommended to use the same operational system, but of course you can use an emulator or a real device connected through wifi or USB.
