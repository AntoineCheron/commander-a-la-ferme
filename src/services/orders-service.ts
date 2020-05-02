import { Pool } from 'pg'

import { Order, OrderWithoutId, OrderedItem } from '../models'
import { NotFound } from '../error'

export default class OrderService {
  constructor (private pool: Pool) {}

  public async list (farmName: string): Promise<Order[]> {
    try {
      const res = await this.pool.query(LIST_ORDERS_QUERY(farmName))
      return res.rows.reduce((acc: Order[], row) => {
        if (acc.length === 0 || acc[acc.length - 1].id !== row.id) {
          const order = extractOrder(row)
          order.items.push(extractItem(row))
          acc.push(order)
        } else {
          acc[acc.length - 1].items.push(extractItem(row))
        }
        return acc
      }, [] as Order[])
    } catch (error) {
      // TODO: manage errors appropriately
      throw error
    }
  }

  public async getOrder (orderId: string, farmName: string): Promise<Order> {
    try {
      const query = {
        text: GET_ORDER_QUERY(farmName),
        values: [orderId]
      }
      const res = await this.pool.query(query)

      if (res.rowCount > 0) {
        const order = extractOrder(res.rows[0])
        order.items = res.rows.map(row => extractItem(row))
        return order
      } else {
        throw new NotFound()
      }
    } catch (error) {
      // TODO: manage errors appropriately
      throw error
    }
  }

  public async createOrder (
    order: OrderWithoutId,
    farmName: string
  ): Promise<void> {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')

      const orderCreationRes = await client.query(ADD_ORDER_QUERY(farmName), [
        order.fullname,
        order.telephone,
        order.address,
        order.paymentMethod
      ])
      const newOrderId = orderCreationRes.rows[0].id

      await Promise.all(
        order.items.map(item =>
          client.query(ADD_ORDER_ITEM_QUERY(farmName), [
            item.id,
            newOrderId,
            item.title,
            item.category,
            item.price,
            item.amount
          ])
        )
      )

      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  }

  // public async updateOrder (
  //   orderId: string,
  //   value: OrderWithoutId,
  //   farmName: string
  // ): Promise<void> {
  //   const orders = await this.list(farmName)
  //   const order = orders.find(order => order.id === orderId)

  //   if (order !== undefined) {
  //     const index = orders.indexOf(order)
  //     orders[index] = { id: orderId, ...value }
  //   } else {
  //     throw new NotFound()
  //   }
  // }

  public async completeOrder (
    orderId: string,
    farmName: string
  ): Promise<void> {
    try {
      const query = {
        text: UPDATE_ORDER_STATUS_QUERY(farmName),
        values: [orderId, 'completed']
      }
      const res = await this.pool.query(query)
      if (res.rowCount === 0) {
        throw new NotFound()
      } else {
        throw new Error()
      }
    } catch (error) {
      // TODO: manage errors appropriately
      throw error
    }
  }

  public static async createTables (farmName: string, pool: Pool) {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS ${farmName}_orders ( 
        id SERIAL PRIMARY KEY,  
        fullname VARCHAR(40) NOT NULL, 
        telephone VARCHAR(12) NOT NULL, 
        address VARCHAR(100), 
        paymentMethod VARCHAR(30) NOT NULL, 
        status VARCHAR(30) DEFAULT 'new', 
        passedOn DATE DEFAULT CURRENT_DATE,
        customerComment VARCHAR(1000)
      ); `
    )

    await pool.query(
      `CREATE TABLE IF NOT EXISTS ${farmName}_ordered_items ( 
        id VARCHAR(255) REFERENCES ${farmName}_inventory(id), 
        order_id INTEGER NOT NULL REFERENCES ${farmName}_orders(id),
        title VARCHAR(255) NOT NULL, 
        category VARCHAR(100), 
        price NUMERIC(7,2) NOT NULL, 
        amount INTEGER NOT NULL, 
        PRIMARY KEY(id, order_id)
      ); `
    )
  }
}

function LIST_ORDERS_QUERY (farmName: string) {
  return `SELECT
      Orders.id as id,
      Orders.fullname as fullname,
      Orders.telephone as telephone,
      Orders.address as address,
      Orders.paymentmethod as paymentmethod,
      Orders.status as status,
      Orders.passedon as passedon,
      Items.id as itemId,
      Items.title as itemtitle,
      Items.category as itemtategory,
      Items.price as itemprice,
      Items.amount as itemamount
    FROM ${farmName}_orders AS Orders
    INNER JOIN ${farmName}_ordered_items AS Items ON Orders.id = Items.order_id ; `
}

function GET_ORDER_QUERY (farmName: string) {
  return `SELECT 
    Orders.id as id, 
    Orders.fullname as fullname, 
    Orders.telephone as telephone, 
    Orders.address as address, 
    Orders.paymentMethod as paymentmethod, 
    Orders.status as status, 
    Orders.passedOn as passedon, 
    Items.id as itemid, 
    Items.title as itemtitle, 
    Items.category as itemcategory, 
    Items.price as itemprice, 
    Items.amount as itemamount 
  FROM ${farmName}_orders AS Orders 
  INNER JOIN ${farmName}_ordered_items AS Items ON Orders.id = Items.order_id 
  WHERE Orders.id = $1;`
}

function ADD_ORDER_QUERY (farmName: string) {
  return `INSERT INTO ${farmName}_orders(fullname, telephone, address, paymentMethod) VALUES ($1, $2, $3, $4) RETURNING *;`
}

// TODO: retrieve price from the DB instead
function ADD_ORDER_ITEM_QUERY (farmName: string) {
  return `INSERT INTO ${farmName}_ordered_items(id, order_id, title, category, price, amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`
}

function UPDATE_ORDER_STATUS_QUERY (farmName: string) {
  return `UPDATE ${farmName}_orders SET status=$2 WHERE id=$1;`
}

function extractItem (row: any): OrderedItem {
  return {
    id: row.itemid,
    title: row.itemtitle,
    category: row.itemcategory,
    price: row.itemprice,
    amount: row.itemamount
  }
}

function extractOrder (row: any): Order {
  return {
    id: row.id,
    fullname: row.fullname,
    telephone: row.telephone,
    address: row.address,
    paymentMethod: row.paymentmethod,
    status: row.status,
    passedOn: row.passedon,
    items: []
  }
}
