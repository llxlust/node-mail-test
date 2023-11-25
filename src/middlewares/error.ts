import { type NextFunction, type Request } from 'express'
import ErrorResponse from '../utils/errorRespones'
import { type IErrorResponse } from '../types/generic'
interface ErrorResponseHandler extends ErrorResponse {
  code?: number
  errors?: Record<string, { message: string }>
}
function errorHandler (err: ErrorResponseHandler, req: Request, res: IErrorResponse, next: NextFunction): void {
  let error = { ...err }
  error.message = err.message
  console.log(err)

  // Mongoose duplication key
  if (err.code === 11000) {
    const message = 'Duplication field value entered'
    error = new ErrorResponse(message, 400)
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors ?? {}).map(val => val.message).join(' ')
    error = new ErrorResponse(message, 400)
  }
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found'
    error = new ErrorResponse(message, 404)
  }
  res.status(error.statusCode ?? 500).json({
    success: false,
    message: error.message ?? 'Server error',
    timestamp: Date.now()
  })
}

export default errorHandler
