import { type NextFunction, type Request, type Response } from 'express'

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => void) =>
    async (req: Request, res: Response, next: NextFunction) => {
      // eslint-disable-next-line
      Promise.resolve(fn(req, res, next)).catch(next)
    }
