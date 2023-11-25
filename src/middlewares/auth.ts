import { type NextFunction, type Response } from 'express'
import User from '../models/User'
import { type ISingleResponse } from '../types/generic'
import { type IRequsetWithUser, type IJwtAuthPayload, type IUser, type UserRole } from '../types/user.types'
import ErrorResponse from '../utils/errorRespones'
import { asyncHandler } from './async'
import jwt from 'jsonwebtoken'
// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  //   else if (req.cookies.token) {
  //     token = req.cookies.token
  //   }
  if (!token) {
    next(new ErrorResponse('Not authorized to access this route', 401))
    return
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as IJwtAuthPayload
    const currentUser = await User.findById(decoded.id)
    if (currentUser) {
      (req as IRequsetWithUser).user = currentUser
    }
    next()
  } catch (error) {
    next(new ErrorResponse('Not authhorized to access this route', 401))
  }
})

export const authorize = (...roles: UserRole[]) => {
  return (req: IRequsetWithUser, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role as UserRole)) {
      next(
        new ErrorResponse(
          `User role ${req.user?.role} is not authorized to access this route`,
          403
        )
      )
    }
    next()
  }
}
