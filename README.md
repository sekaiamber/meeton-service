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
# Database informations
DB_HOST=127.0.0.1
DB_NAME=meeton
DB_USER=root
DB_PASS=
# time scale, using for event system. for examle:
# DEV_TIMESCALE=0.0006944444444444445
# makes 1 day become 1 min.
DEV_TIMESCALE=
# TON CENTER API key for Tonweb
TONCENTER_API_KEY=
# MEE token contract address
MEE_CONTRACT_ADDRESS=
# base urls for reply photos
MARKET_ITEM_BASE_URL=
TRAVEL_TREASURES_BASE_URL=
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

## Why you need to generate wallet out of system?

Here we are using ‘ton-crypto’ to generate TON wallet address, when using `mnemonicNew(24, ‘pwd’)` to generate a set of mnemonics, we found it takes a lot of time on our MacPro(M1 Max, 64G mem).

It is confused that, the cost is not stable, some times only take 500ms, some times 10s.

Your can use [this gist](https://gist.github.com/sekaiamber/0f80fdffc8dbf11cdf2c92a8e5bfd747
) for testing case.

In our point of view, it is ok to spend a certain amount of time to generate addresses, but if this cost is unstable, it will cause uncertainty, because we cannot make sure that this process will finally finish, if it has a probability that will takes a very long time, then other business processes will be blocked by it.

So you also can startup a task to check if the unused wallet address is enough.


## Can't get 'chat_member'?

[view this issue](https://github.com/yagop/node-telegram-bot-api/issues/923)

## TON CENTER API KEY?

Register your API key in the @tonapibot to get access with higher limits.

## TONweb Example

https://github.com/toncenter/examples

## Explorers

https://tonapi.io/
https://tonscan.org/
