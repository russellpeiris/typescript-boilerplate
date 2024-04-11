import bycrypt from 'bcrypt'
import { Schema, model } from 'mongoose'
import { hashPassword } from '../../utils/hash.util'

export interface IUser extends Document {
  username: string
  password: string
  comparePassword(password: string): Promise<boolean>
}
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await hashPassword(user.password)
  }
  next()
})

userSchema.methods.comparePassword = async function (password: string) {
  return await bycrypt.compare(password, this.password)
}

const User = model<IUser>('User', userSchema)

export default User
