import mongoose, { type Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import {
  UserRole,
  type IUser,
  type IUserMethods,
  type IRequsetWithUser
} from '../types/user.types'
import { type NextFunction, type Response } from 'express'
import ErrorResponse from '../utils/errorRespones'
export const UserMode = 'User'
export type UserModelType = Model<IUser, Record<string, unknown>, IUserMethods>
const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please add a username']
  },
  email: {
    type: String,
    require: [true, 'Please add a email'],
    unique: true,
    match: [
      // eslint-disable-next-line
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: [UserRole.user, UserRole.admin],
    default: UserRole.user
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  resetPasswordExpire: String,
  resetPasswordToken: Date,
  createAt: {
    type: Date,
    default: Date.now
  },
  updateAt: {
    type: Date,
    default: Date.now
  }
})

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Sigh JWT and Return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// Match user entered password to hashed password in db
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000
  return resetToken
}

export default mongoose.model<IUser, UserModelType>(UserMode, UserSchema)
