import { type Request } from 'express'
import { type JwtPayload } from 'jsonwebtoken'

export enum UserRole {
  user = 'user',
  admin = 'admin'
}

export interface IUser {
  id?: string
  name: string
  email: string
  role: string
  password: string
  resetPasswordToken?: string
  resetPasswordExpire?: Date
  createAt: Date
  updateAt: Date
}
export interface IUserMethods {
  getSignedJwtToken: () => string
  matchPassword: (password: string) => Promise<boolean>
  getResetPasswordToken: () => string
}

export interface IUserAuthResponse {
  user: IUser
  token: string
}

export interface IUserAndMethod extends IUser, IUserMethods {

}
export interface IJwtAuthPayload extends JwtPayload {
  id: string
}
export interface IRequsetWithUser extends Request {
  user?: IUser
}
