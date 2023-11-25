import { type NextFunction, type Request } from 'express'
import { type ISingleResponse } from '../types/generic'
import { type IUser } from '../types/user.types'
import User from '../models/User'
import { asyncHandler } from '../middlewares/async'

// @desc Get one user
// @route GET /api/v1/users
// @access private

export const getUser = asyncHandler(async (req: Request, res: ISingleResponse<IUser>): Promise<void> => {
  const user = await User.findById(req.params.id)
  if (user) {
    res.status(200).json({
      data: user,
      timestamp: Date.now()
    })
  }
})

// @desc Get one user
// @route GET /api/v1/users
// @access private

export const createUser = asyncHandler(async (req: Request,
  res: ISingleResponse<IUser>,
  next: NextFunction
): Promise<void> => {
  const user = await User.create(req.body)

  res.status(201).json({
    data: user,
    timestamp: Date.now()
  })
})
