import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { fileURLToPath } from 'node:url'
import { errorHandler } from './lib/errors.js'
import { weatherRouter } from './routes/weatherRoutes.js'

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) })

export const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', weatherRouter)
app.use(errorHandler)
