const { Pool } = require('pg')

class Database {
  readonly pool: any

  public constructor () {
    this.pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'commanderalaferme',
      password: 'pass',
      port: 5432
    })

    this.pool.on('connect', () => console.log('Connected to the db'))
  }

  public createAllTables (): void {
    this.createUserTable()
  }

  public createUserTable (): void {
    const userCreateQuery = `CREATE TABLE IF NOT EXISTS users
    (id VARCHAR(255) PRIMARY KEY, 
    username VARCHAR(100) UNIQUE NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    farmName VARCHAR(100));`

    this.pool.query(userCreateQuery).catch((err: Error) => {
      console.error(err)
      this.pool.end()
    })
  }

  public dropAllTables () {
    this.dropUserTable()
  }

  public dropUserTable () {
    const usersDropQuery = 'DROP TABLE IF EXISTS users'
    this.pool
      .query(usersDropQuery)
      .then(() => this.pool.end())
      .catch((err: Error) => {
        console.log(err)
        this.pool.end()
      })
  }
}

export default Database
