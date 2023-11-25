import { type Response } from 'express'

interface ISingleReturn<T> {
  data: T
  timestamp: number
}
interface IErrorReturn {
  succes: false
  message: string
  timestamp: number
}

export interface ISingleResponse<T> extends Response {
  json: (body: ISingleReturn<T>) => this
}

export interface IErrorResponse extends Response {
  json: (body: ISingleReturn) => this
}
