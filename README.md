# MEETON SERVICE

## Develop

```
yarn
```

### ENV
```yaml
# if DEBUG=1, will show all debug logs
DEBUG=1
BOT_TOKEN=
# password for generating TON wallet
WALLET_PASSWORD=
# Database informations
DB_HOST=127.0.0.1
DB_NAME=meeton
DB_USER=root
DB_PASS=
# time scale, using for event system. for examle:
# DEV_TIMESCALE=0.0006944444444444445
# makes 1 day become 1 min.
DEV_TIMESCALE=
```

### Service

Using following command to start server.

```
yarn run start
```

### Task

Using following command to start task runner.

```
yarn run start_task
```

### Scripts

Using following command to run script.

```
yarn run script -- ./lib/scripts/__SCRIPT_NAME__.js
```

Looking for `src/scripts` folder to geet `__SCRIPT_NAME__`.

* `createNewWallet.js`: this script will create 10 new wallet into database.
* `importTravelTargetsAndTreasures.js`: this script will import targets and treasures into database, see `src/constants/targets.ts` and `src/constants/treasures.ts`.

## Create boot

1. talk to [botFather](https://t.me/botfather).
2. send `/newbot`, set name and handler.
3. save session like `110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw`
4. send `/mybots`, edit bot informations, `Description` shows on the welcome page.

## Commends

## Can't get 'chat_member'?

[view this issue](https://github.com/yagop/node-telegram-bot-api/issues/923)