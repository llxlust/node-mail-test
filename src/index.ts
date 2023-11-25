import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
// eslint-disable-next-line
// @ts-ignore:next-line
import { xss } from 'express-xss-sanitizer'
import userRouter from './routes/users'
import authRoutes from './routes/auth'
import { Version } from './utils/constants'
import connectDB from './config/db'
import errorHandler from './middlewares/error'
dotenv.config()
// eslint-disable-next-line
if (!process.env.PORT) {
  process.exit(1)
}

void connectDB()
const PORT: number = parseInt(process.env.PORT)

const app = express()
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Dev logging middle ware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(`/api/${Version.V1}/users`, userRouter)
app.use(`/api/${Version.V1}/auth`, authRoutes)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`server live on port ${PORT}`)
})
