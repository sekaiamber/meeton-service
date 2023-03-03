import { Context } from 'telegraf'
import { User } from '../db/models'

export interface MeetonContext extends Context {
  userModel: User
}
