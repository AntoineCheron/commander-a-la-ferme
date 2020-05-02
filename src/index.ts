import express from 'express'
import path from 'path'
const morgan = require('morgan')

import { PORT } from './config'
import RestApi from './rest-api'
import Database from './services/database-service'

const database = new Database()
const pool = database.pool

console.log('Connecting to the database...')
pool
  .connect()
  .then(() => {
    console.log('Create database tables')
    database.createAllTables()

    const app = express()
    app.use(
      morgan(':method :url :status :res[content-length] - :response-time ms')
    )
    app.use(express.json())

    app.use('/api', RestApi(pool))
    app.use(express.static(path.join(__dirname, '../client/build')))
    app.get('*', (_, res) =>
      res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
    )

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  })
  .catch((error: Error) => {
    console.error(
      'Impossible to establish a connection with the database.\n',
      error.stack
    )
    process.exit(0)
  })
