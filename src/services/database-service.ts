import pg from 'pg'
import { ENV } from '../config'
import { PsqlUtils } from '../utils'

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
      ssl: { rejectUnauthorized: false }
    }
  }
}

class Database {
  readonly pool: any

  public constructor () {
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

  public static async createFarmDedicatedTables (
    pool: pg.Pool,
    farmName: string
  ): Promise<void> {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS ${PsqlUtils.toDbStr(farmName)}_inventory ( 
        id VARCHAR(255) PRIMARY KEY, 
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price NUMERIC(7,2) NOT NULL,
        remaining INTEGER NOT NULL
      ); `
    )

    await pool.query(
      `CREATE TABLE IF NOT EXISTS ${PsqlUtils.toDbStr(farmName)}_orders ( 
        id SERIAL PRIMARY KEY,  
        fullname VARCHAR(40) NOT NULL, 
        telephone VARCHAR(30) NOT NULL, 
        address VARCHAR(100), 
        paymentMethod VARCHAR(30) NOT NULL, 
        status VARCHAR(30) DEFAULT 'new', 
        passedOn DATE DEFAULT CURRENT_DATE,
        customerComment VARCHAR(1000)
      ); `
    )

    await pool.query(
      `CREATE TABLE IF NOT EXISTS ${PsqlUtils.toDbStr(
        farmName
      )}_ordered_items ( 
        id VARCHAR(255) REFERENCES ${PsqlUtils.toDbStr(
          farmName
        )}_inventory(id), 
        order_id INTEGER NOT NULL REFERENCES ${PsqlUtils.toDbStr(
          farmName
        )}_orders(id),
        title VARCHAR(255) NOT NULL, 
        category VARCHAR(100), 
        price NUMERIC(7,2) NOT NULL, 
        amount NUMERIC(7,2) NOT NULL, 
        PRIMARY KEY(id, order_id)
      ); `
    )

    await pool.query(
      `CREATE VIEW ${PsqlUtils.toDbStr(farmName)}_inventory_view AS
          SELECT inventory.*,
          ( SELECT sum(item.amount) 
            FROM ${PsqlUtils.toDbStr(farmName)}_ordered_items item
            WHERE item.id = inventory.id
          ) as ordered
          FROM ${PsqlUtils.toDbStr(farmName)}_inventory inventory
      ;`
    )
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
