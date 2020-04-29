import uuid from 'uuid/v4'
import { Pool } from 'pg'

import { InventoryItem, InventoryItemWithoutId } from '../models'
import { NotFound } from '../error'

export default class InventoryService {
  // private items: { [farmName: string]: InventoryItem[] } = {
  //   'Bergerie de Bubertre': [
  //     {
  //       id: '1',
  //       title: 'Crottins de brebis BIO',
  //       category: 'Produits en lait BIO de brebis',
  //       price: 2.5,
  //       remaining: 80
  //     },
  //     {
  //       id: '2',
  //       title: 'Crottins de chèvre BIO',
  //       category: 'Produits en lait BIO de chèvres',
  //       price: 2.25,
  //       remaining: 80
  //     },
  //     {
  //       id: '3',
  //       title: 'Crottins de brebis',
  //       category: 'Produits en lait BIO de brebis',
  //       price: 2.5,
  //       remaining: 80
  //     }
  //   ]
  // }

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
        values: [uuid(), item.title, item.category, item.price]
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
        values: [itemId, value.title, value.category, value.price]
      }
      const res = await this.pool.query(query)
      if (res.rowCount === 1) {
        const row = res.rows[0]
        return { ...row, remaining: -1 }
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

  public static createTables (farmName: string, pool: Pool) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS ${farmName}_inventory ( ` +
        'id VARCHAR(255) PRIMARY KEY,  ' +
        'title VARCHAR(255) NOT NULL, ' +
        'category VARCHAR(100) NOT NULL, ' +
        '); '
    )
  }
}

function ADD_ITEM_QUERY (farmName: string) {
  return `INSERT INTO ${farmName}_inventory(id, title, category, price) VALUES ($1, $2, $3, $4) RETURNING *;`
}

function GET_INVENTORY_QUERY (farmName: string) {
  return `SELECT id, title, category, price FROM ${farmName}_inventory;`
}

function UPDATE_ITEM_QUERY (farmName: string) {
  return `UPDATE ${farmName}_inventory SET title=$2, category=$3, price=$4 WHERE id=$1;`
}

function DELETE_ITEM_QUERY (farmName: string) {
  return `DELETE FROM ${farmName}_inventory WHERE id=$1;`
}
