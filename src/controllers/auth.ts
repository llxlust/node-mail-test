import { type Request } from 'express'
import { asyncHandler } from '../middlewares/async'
import { type ISingleResponse } from '../types/generic'
import {
  type IUserAuthResponse,
  type IUser,
  type IUserAndMethod,
  type IRequsetWithUser
} from '../types/user.types'
import User from '../models/User'
import ErrorResponse from '../utils/errorRespones'
import { sendEmail } from '../utils/sendEmail'

export const register = asyncHandler(
  async (
    req: Request,
    res: ISingleResponse<IUserAuthResponse>
  ): Promise<void> => {
    const { name, email, password, role } = req.body

    // Create User
    const user = await User.create({
      name,
      email,
      password,
      role
    })

    sendTokenResponse(user, 200, res)
  }
)

export const login = asyncHandler(async (req, res, next): Promise<void> => {
  const { email, password } = req.body

  // Validate email & password
  if (!email || !password) {
    next(new ErrorResponse('Please provide email and password', 400))
  }
  // Check user
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    next(new ErrorResponse('Invalid Credential', 401))
    return
  }

  // Check if password is matches
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    next(new ErrorResponse('Invalid credential', 401))
    return
  }
  sendTokenResponse(user, 200, res)
})

// Get token from model send response

const sendTokenResponse = (
  user: IUserAndMethod,
  statusCode: number,
  res: ISingleResponse<IUserAuthResponse>
): void => {
  const token = user.getSignedJwtToken()

  const option = {
    expire: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRE as string, 10) *
          24 *
          60 *
          60 *
          1000
    ),
    httpOnly: true,
    secure: true
  }
  if (process.env.NODE_ENV !== 'production') {
    option.secure = false
  }
  res.status(statusCode).cookie('token', token, option).json({
    data: { user, token },
    timestamp: Date.now()
  })
}

export const getMe = asyncHandler(async (req: IRequsetWithUser, res: ISingleResponse<IUser | null>, next) => {
  console.log(req.user)
  const user = await User.findById((req.user as IUser).id)

  res.status(200).json({
    data: user,
    timestamp: Date.now()
  })
})

export const forgotPassword = asyncHandler(async (req, res: ISingleResponse<string>, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    next(new ErrorResponse('This is no user with this email', 404))
    return
  }

  // Get reset token
  console.log(user.matchPassword)
  const resetToken = user.getResetPasswordToken()
  await user.save({ validateBeforeSave: false })

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`

  const message = `You are receiving this email because you (or someone) has requeseted the rest of a password.Please make a PATCH requet to: \n\n ${resetUrl}`
  try {
    await sendEmail({ email: user.email, subject: 'Password reset token ', message })
    res.status(200).json({
      data: 'email sent',
      timestamp: Date.now()
    })
  } catch (error) {
    console.log(error)
    user.resetPasswordExpire = undefined
    user.resetPasswordToken = undefined

    await user.save({ validateBeforeSave: true })

    next(new ErrorResponse('Email could not be sent ', 500))
  }
})
