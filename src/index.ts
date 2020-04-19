import express from 'express'
import path from 'path'
// import morgan from 'morgan'

import restApi from './rest-api'

import { PORT } from './config'

const app = express()

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(express.json())

app.use('/api', restApi)
app.use(express.static(path.join(__dirname, '../client/build')))
app.get('*', (_, res) =>
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
)

app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`)
})
