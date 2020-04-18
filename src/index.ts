import express from 'express'
// import morgan from 'morgan'

import restApi from './rest-api'

import { PORT } from './config'

const app = express()

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(express.json())
app.use(restApi)

app.listen(PORT, function () {
  console.log(`We have started our server on port ${PORT}`)
})
