/**
 * @author Yuriy Matviyuk
 */
import { Schema, Types } from 'mongoose'

const Schemas = {
  /**
   * User entity Schema
   */
  UserSchema: new Schema(
    {
      email: { type: String, required: true, select: false },
      password: { type: String, required: true, select: false },
      avatar: String,
      battles: [{ type: Schema.Types.ObjectId, ref: 'Battle' }],
      likedBattles: [{ type: Schema.Types.ObjectId, ref: 'Battle' }],
      rating: { type: Number, default: 0 },
      subscription: Object,
      likesQty: { type: Array, default: 0 },
      opponents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      gender: { type: String, required: true },
      name: { type: String, required: true },
      notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
      surname: { type: String, required: true }
    }
  ),

  /**
   * Battle entity Schema
   */
  BattleSchema: new Schema(
    {
      author: { type: Types.ObjectId, required: true },
      active: { type: Boolean, required: true, default: false },
      gender: { type: String, required: true },
      users: {
        user1: {
          data: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
          },
          photo: { type: String, required: true },
          likesQty: { type: Number, default: 0 }
        },
        user2: {
          data: {
            type: Types.ObjectId,
            required: true,
            ref: 'User'
          },
          photo: { type: String, required: true },
          likesQty: { type: Number, default: 0 }
        }
      }
    }
  ),

  /**
   * Notification entity Schema
   */
  NotificationSchema: new Schema(
    {
      title: { type: String, required: true },
      body: { type: Object, required: true },
      image: String,
      action: String
    }
  )
}

export default Schemas
