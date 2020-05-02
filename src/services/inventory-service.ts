import { v4 as uuid } from 'uuid'
import { Pool } from 'pg'

import { InventoryItem, InventoryItemWithoutId } from '../models'
import { NotFound } from '../error'

export default class InventoryService {
  constructor (private pool: Pool) {}

  public async getInventory (farmName: string): Promise<InventoryItem[]> {
    try {
      const res = await this.pool.query(GET_INVENTORY_QUERY(farmName))
      return res.rows
    } catch (error) {
      // TODO: manage errors appropriately
      throw error
    }
  }

  public async addItem (
    item: InventoryItemWithoutId,
    farmName: string
  ): Promise<InventoryItem> {
    try {
      const query = {
        text: ADD_ITEM_QUERY(farmName),
        values: [uuid(), item.title, item.category, item.price, item.remaining]
      }
      const res = await this.pool.query(query)
      if (res.rowCount === 1) {
        const row = res.rows[0]
        return { ...row, remaining: -1 }
      } else {
        throw new Error()
      }
    } catch (error) {
      // TODO: manage errors appropriately
      throw error
    }
  }

  public async updateItem (
    itemId: string,
    value: InventoryItemWithoutId,
    farmName: string
  ): Promise<void> {
    try {
      const query = {
        text: UPDATE_ITEM_QUERY(farmName),
        values: [
          itemId,
          value.title,
          value.category,
          value.price,
          value.remaining
        ]
      }
      const res = await this.pool.query(query)
      if (res.rowCount === 1) {
        const row = res.rows[0]
        return { ...row, ordered: -1 }
      } else if (res.rowCount === 0) {
        throw new NotFound()
      } else {
        throw new Error()
      }
    } catch (error) {
      // TODO: manage errors appropriately
      throw error
    }
  }

  public async deleteItem (itemId: string, farmName: string): Promise<void> {
    try {
      const query = {
        text: DELETE_ITEM_QUERY(farmName),
        values: [itemId]
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

  public static async createTables (
    farmName: string,
    pool: Pool
  ): Promise<void> {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS ${farmName}_inventory ( 
        id VARCHAR(255) PRIMARY KEY, 
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price NUMERIC(7,2) NOT NULL,
        remaining INTEGER NOT NULL
      ); `
    )
  }
}

function ADD_ITEM_QUERY (farmName: string) {
  return `INSERT INTO ${farmName}_inventory(id, title, category, price, remaining) VALUES ($1, $2, $3, $4, $5) RETURNING *;`
}

function GET_INVENTORY_QUERY (farmName: string) {
  return `SELECT id, title, category, price, remaining FROM ${farmName}_inventory;`
}

function UPDATE_ITEM_QUERY (farmName: string) {
  return `UPDATE ${farmName}_inventory SET title=$2, category=$3, price=$4, remaining=$5 WHERE id=$1;`
}

function DELETE_ITEM_QUERY (farmName: string) {
  return `DELETE FROM ${farmName}_inventory WHERE id=$1;`
}
