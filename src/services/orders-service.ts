import { Pool } from 'pg'

import { Order, OrderWithoutId, OrderedItem, OrderStatus } from '../models'
import { NotFound } from '../error'
import { PsqlUtils } from '../utils'

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
        order.paymentMethod,
        order.customerComment
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

  public async updateStatus (
    orderId: string,
    status: OrderStatus,
    farmName: string
  ): Promise<void> {
    try {
      const query = {
        text: UPDATE_ORDER_STATUS_QUERY(farmName),
        values: [orderId, status]
      }
      const res = await this.pool.query(query)
      if (res.rowCount === 0) {
        throw new NotFound()
      }
    } catch (error) {
      // TODO: manage errors appropriately
      throw error
    }
  }
}

function LIST_ORDERS_QUERY (farmName: string) {
  return `SELECT
      Orders.id as id,
      Orders.fullname as fullname,
      Orders.telephone as telephone,
      Orders.address as address,
      Orders.paymentmethod as paymentmethod,
      Orders.customercomment as customercomment,
      Orders.status as status,
      Orders.passedon as passedon,
      Items.id as itemId,
      Items.title as itemtitle,
      Items.category as itemtategory,
      Items.price as itemprice,
      Items.amount as itemamount
    FROM ${PsqlUtils.toDbStr(farmName)}_orders AS Orders
    INNER JOIN ${PsqlUtils.toDbStr(
      farmName
    )}_ordered_items AS Items ON Orders.id = Items.order_id ; `
}

function GET_ORDER_QUERY (farmName: string) {
  return `SELECT 
    Orders.id as id, 
    Orders.fullname as fullname, 
    Orders.telephone as telephone, 
    Orders.address as address, 
    Orders.paymentMethod as paymentmethod, 
    Orders.customerComment as customercomment, 
    Orders.status as status, 
    Orders.passedOn as passedon, 
    Items.id as itemid, 
    Items.title as itemtitle, 
    Items.category as itemcategory, 
    Items.price as itemprice, 
    Items.amount as itemamount 
  FROM ${PsqlUtils.toDbStr(farmName)}_orders AS Orders 
  INNER JOIN ${PsqlUtils.toDbStr(
    farmName
  )}_ordered_items AS Items ON Orders.id = Items.order_id 
  WHERE Orders.id = $1;`
}

function ADD_ORDER_QUERY (farmName: string) {
  return `INSERT INTO ${PsqlUtils.toDbStr(
    farmName
  )}_orders(fullname, telephone, address, paymentMethod, customerComment) VALUES ($1, $2, $3, $4, $5) RETURNING *;`
}

function ADD_ORDER_ITEM_QUERY (farmName: string) {
  return `
  INSERT INTO ${PsqlUtils.toDbStr(farmName)}_ordered_items 
    ( id, order_id, title, category, price, amount ) 
    SELECT $1, $2, title, category, price, $3
    FROM ${PsqlUtils.toDbStr(farmName)}_inventory inventory 
    WHERE inventory.id = $1
    RETURNING *
  ;`
}

function UPDATE_ORDER_STATUS_QUERY (farmName: string) {
  return `UPDATE ${PsqlUtils.toDbStr(
    farmName
  )}_orders SET status=$2 WHERE id=$1;`
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
    customerComment: row.customercomment,
    status: row.status,
    passedOn: row.passedon,
    items: []
  }
}
