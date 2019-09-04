/**
 * @author Yuriy Matviyuk
 */
import Schemas from './Schemas'
import mongoose from 'mongoose'

const Models = {
  /**
  * Battle model
  */
  Battle: mongoose.model('Battle', Schemas.BattleSchema, 'battle'),

  /**
  * User model
  */
  User: mongoose.model('User', Schemas.UserSchema, 'user'),

  /**
   * Notification model
   */
  Notification: mongoose.model('Notification', Schemas.NotificationSchema, 'notification')
}

export default Models
