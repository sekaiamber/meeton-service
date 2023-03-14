import { Sequelize } from 'sequelize-typescript'
import * as Models from './models'
// import { promisify } from 'util'

const { DB_HOST, DB_NAME, DB_USER, DB_PASS } = process.env
const {
  Constant,
  User,
  Wallet,
  InitFavorabilityTest,
  Status,
  UserInnerTask,
  Location,
  Travel,
  TravelTarget,
  TravelTreasure,
  Balance,
  Deposit,
  MarketItem,
  UserMarketItem,
} = Models

const sequelize = new Sequelize({
  host: DB_HOST,
  database: DB_NAME,
  dialect: 'mariadb',
  username: DB_USER,
  password: DB_PASS,
  dialectOptions: {
    timezone: '+00:00',
  },
  logging: false,
  pool: {
    max: 25,
  },
  models: [
    Constant,
    User,
    Wallet,
    InitFavorabilityTest,
    Status,
    UserInnerTask,
    Location,
    TravelTarget,
    TravelTreasure,
    Travel,
    Balance,
    Deposit,
    MarketItem,
    UserMarketItem,
  ],
})

export default sequelize

export { Models }
