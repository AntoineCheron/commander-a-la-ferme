import pg from 'pg'
import { ENV } from '../config'

function getDbConfig () {
  if (ENV === 'dev') {
    return {
      user: 'postgres',
      host: 'localhost',
      database: 'commanderalaferme',
      password: 'pass',
      port: 5432
    }
  } else {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: true
    }
  }
}

class Database {
  readonly pool: any

  public constructor () {
    console.log(getDbConfig())
    this.pool = new pg.Pool(getDbConfig())
    this.pool.on('connect', () => console.log('Opened new DB connection'))
  }

  public createAllTables (): void {
    this.createUserTable()
    this.createFarmsTable()
  }

  public createUserTable (): void {
    const userCreateQuery = `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY, 
      username VARCHAR(100) UNIQUE NOT NULL, 
      password VARCHAR(255) NOT NULL, 
      farmname VARCHAR(100) 
    );`

    this.createTable(userCreateQuery)
  }

  public createFarmsTable (): void {
    const farmsCreateQuery = `CREATE TABLE IF NOT EXISTS farms (
      id VARCHAR(255) PRIMARY KEY, 
      name VARCHAR(100) UNIQUE NOT NULL, 
      telephone VARCHAR(30) NOT NULL, 
      address VARCHAR(100) NOT NULL, 
      description VARCHAR(1000), 
      paymentMethods VARCHAR(100) NOT NULL 
    );`

    this.createTable(farmsCreateQuery)
  }

  private createTable (query: string): void {
    this.pool.query(query).catch((err: Error) => {
      console.error(err)
      this.pool.end()
    })
  }

  public dropAllTables () {
    this.dropTable('users')
    this.dropTable('farms')
  }

  public dropTable (name: string) {
    const usersDropQuery = 'DROP TABLE IF EXISTS ' + name
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
