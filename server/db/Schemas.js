/**
 * @author Yuriy Matviyuk
 */
import { Schema, Types } from 'mongoose'

const Schemas = {
  /**
     * user Schema
     */
  UserSchema: new Schema(
    {
      email: { type: String, required: true },
      password: { type: String, required: true },
      avatar: String,
      battles: [{ type: Schema.Types.ObjectId, ref: 'Battle' }],
      rating: { type: Number, default: 0 },
      photos: { type: Array, default: [] },
      subscription: Object,
      likesQty: { type: Array, default: 0 },
      opponents: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
      gender: { type: String, required: true },
      name: { type: String, required: true },
      surname: { type: String, required: true }
    }
  ),

  /**
     * Battle Schema
     */
  BattleSchema: new Schema(
    {
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
  )
}

export default Schemas
