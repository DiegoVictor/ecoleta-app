# [App] Ecoleta
[![AppVeyor](https://img.shields.io/appveyor/build/diegovictor/ecoleta-app?logo=appveyor&style=flat-square)](https://ci.appveyor.com/project/DiegoVictor/ecoleta-app)
[![typescript](https://img.shields.io/badge/typescript-6.0.3-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![react-native](https://img.shields.io/badge/react--native-0.86.0-61dafb?style=flat-square&logo=react)](https://reactnative.dev/)
[![styled-components](https://img.shields.io/badge/styled_components-6.4.3-db7b86?style=flat-square&logo=styled-components)](https://styled-components.com/)
[![eslint](https://img.shields.io/badge/eslint-10.7.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![jest](https://img.shields.io/badge/jest-29.7.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![expo](https://img.shields.io/badge/expo-57.0.4-000000?style=flat-square&logo=expo)](https://expo.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/ecoleta-app?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/ecoleta-app)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/ecoleta-app/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)


This app version allow everyone to see all collect points near of you or other locations. All the resources used by this application comes from its [`API`](https://github.com/DiegoVictor/ecoleta-api).

## Table of Contents
* [Screenshots](#screenshots)
* [Installing](#installing)
  * [Configuring](#configuring)
    * [.env](#env)
    * [API](#api)
* [Usage](#usage)
  * [Expo](#expo)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Screenshots
Click to expand.<br>
<img src="https://raw.githubusercontent.com/DiegoVictor/ecoleta-app/main/screenshots/index.png" width="32%">
<img src="https://raw.githubusercontent.com/DiegoVictor/ecoleta-app/main/screenshots/points.jpg" width="32%">
<img src="https://raw.githubusercontent.com/DiegoVictor/ecoleta-app/main/screenshots/detail.jpg" width="32%">

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

### .env
In this file you may configure the API's url. Rename the `.env.example` in the root directory to `.env` then just update with your settings.

key|description|default
---|---|---
EXPO_PUBLIC_API_URL|API's url with version (v1)|`http://localhost:3333/v1`

### API
Start the [`API`](https://github.com/DiegoVictor/ecoleta-api) (see its README for more information). In case of any change in the API's `port` or `host` remember to update the `app.json`'s `EXPO_PUBLIC_API_URL` property too.
> Also, maybe you need run reverse command to the API's port: `adb reverse tcp:3333 tcp:3333` or use the `expo` host (e.g. `192.168.0.9`)

# Usage
The first build must be through USB connection, so connect your device (or just open your emulator) and run:

```
$ npm run android
```

Or:

```
$ yarn android
```

> For iOS use `ios` instead of `android`

For the next time you can just start the server running:
```
$ yarn start
```
Or:
```
$ npm run start
```

## Expo

This project was built using [Expo](https://expo.dev), to know how to run it in any environment see [Set up your environment](https://docs.expo.dev/get-started/set-up-your-environment).

# Running the tests
[Jest](https://jestjs.io/) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
