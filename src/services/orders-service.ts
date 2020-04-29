import { Pool } from 'pg'

import { Order, OrderWithoutId, OrderedItem } from '../models'
import { NotFound } from '../error'

export default class OrderService {
  // private orders: { [farmName: string]: Order[] } = {
  //   'Bergerie de Bubertre': [
  //     {
  //       id: '1',
  //       fullname: 'Antoine Cheron',
  //       telephone: '06.12.85.59.89',
  //       address: 'Le Pré de la Grande 61190 Bubertré',
  //       paymentMethod: 'carte',
  //       status: 'new',
  //       passedOn: new Date(Date.now()),
  //       items: [
  //         {
  //           id: '1',
  //           title: 'Crottin chèvres',
  //           category: 'Catégorie 1',
  //           price: 2.25,
  //           amount: 2
  //         },
  //         {
  //           id: '2',
  //           title: 'Crottin brebis',
  //           category: 'Catégorie 2',
  //           price: 22.25,
  //           amount: 4
  //         }
  //       ]
  //     },
  //     {
  //       id: '2',
  //       fullname: 'Antoine Cheron (2)',
  //       telephone: '06.12.85.59.89',
  //       address: 'Le Pré de la Grande 61190 Bubertré',
  //       paymentMethod: 'carte',
  //       status: 'in-progress',
  //       passedOn: new Date(Date.now()),
  //       items: [
  //         {
  //           id: '1',
  //           title: 'Crottin chèvres',
  //           category: 'Catégorie 1',
  //           price: 2.25,
  //           amount: 2
  //         },
  //         {
  //           id: '2',
  //           title: 'Crottin brebis',
  //           category: 'Catégorie 2',
  //           price: 22.25,
  //           amount: 4
  //         }
  //       ]
  //     }
  //   ]
  // }

  constructor (private pool: Pool) {}

  public async list (farmName: string): Promise<Order[]> {
    try {
      const res = await this.pool.query(LIST_ORDERS_QUERY(farmName))
      return res.rows.reduce((acc: Order[], row) => {
        if (acc.length === 0 || acc[acc.length - 1].id !== row.id) {
          acc.push(extractOrder(row))
        } else {
          acc[acc.length - 1].items.push(extractItem(row))
        }
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
      if (res.rowCount === 1) {
        return res.rows[0]
      } else if (res.rowCount === 0) {
        throw new NotFound()
      } else {
        console.error(
          `Found more than one order with id ${orderId}. This should never happen. Please FIX.`
        )
        throw new Error()
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

  public static createTables (farmName: string, pool: Pool) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS ${farmName}_orders ( ` +
        'id SERIAL PRIMARY KEY,  ' +
        'fullname VARCHAR(40) NOT NULL, ' +
        'telephone VARCHAR(12) NOT NULL, ' +
        'address VARCHAR(100), ' +
        'paymentMethod VARCHAR(30) NOT NULL, ' +
        'status VARCHAR(30) DEFAULT new, ' +
        'passedOn DATE NOT NULL DEFAULT CURRENT_DATE ' +
        '); '
    )

    pool.query(
      `CREATE TABLE IF NOT EXISTS ${farmName}_ordered_items ` +
        `id VARCHAR(255) REFERENCES ${farmName}_inventory(id), ` +
        `order_id NOT NULL REFERENCES ${farmName}_orders(id) , ` +
        'title VARCHAR(255) NOT NULL, ' +
        'category VARCHAR(100), ' +
        'price NUMERIC(7,2) NOT NULL, ' +
        'amount INTEGER NOT NULL, ' +
        'PRIMARY KEY(id, order_id) ' +
        '); '
    )
  }
}

function LIST_ORDERS_QUERY (farmName: string) {
  return (
    'SELECT ' +
    'Orders.id as id, ' +
    'Orders.fullname as fullname, ' +
    'Orders.telephone as telephone, ' +
    'Orders.address as address, ' +
    'Orders.paymentMethod as paymentMethod, ' +
    'Orders.status as status, ' +
    'Orders.passedOn as passedOn, ' +
    'Items.id as itemId, ' +
    'Items.title as itemTitle, ' +
    'Items.category as itemCategory, ' +
    'Items.price as itemPrice, ' +
    'Items.amount as itemAmount, ' +
    `FROM ${farmName}_orders AS Orders ` +
    `INNER JOIN ${farmName}_ordered_items AS Items ON Orders.id = Items.order_id;`
  )
}

function GET_ORDER_QUERY (farmName: string) {
  return (
    'SELECT ' +
    'Orders.id as id, ' +
    'Orders.fullname as fullname, ' +
    'Orders.telephone as telephone, ' +
    'Orders.address as address, ' +
    'Orders.paymentMethod as paymentMethod, ' +
    'Orders.status as status, ' +
    'Orders.passedOn as passedOn, ' +
    'Items.id as itemId, ' +
    'Items.title as itemTitle, ' +
    'Items.category as itemCategory, ' +
    'Items.price as itemPrice, ' +
    'Items.amount as itemAmount, ' +
    `FROM ${farmName}_orders AS Orders ` +
    `INNER JOIN ${farmName}_ordered_items AS Items ON Orders.id = Items.order_id` +
    'WHERE Orders.id = $1;'
  )
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
    id: row.item.itemId,
    title: row.item.itemTitle,
    category: row.item.itemCategory,
    price: row.item.itemPrice,
    amount: row.item.itemAmount
  }
}

function extractOrder (row: any): Order {
  const item = extractItem(row)
  return {
    id: row.id,
    fullname: row.fullname,
    telephone: row.telephone,
    address: row.address,
    paymentMethod: row.paymentMethod,
    status: row.status,
    passedOn: row.passedOn,
    items: [item]
  }
}
