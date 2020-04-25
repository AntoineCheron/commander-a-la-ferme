import express from 'express'
import path from 'path'
import cors from 'cors'
// import morgan from 'morgan'

import restApi from './rest-api'

import { PORT } from './config'

const app = express()

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(express.json())

app.use(
  '/api',
  cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    preflightContinue: true
  })
)

app.use('/api', restApi)

app.use(express.static(path.join(__dirname, '../client/build')))
app.get('*', (_, res) =>
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
)
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`)
})
