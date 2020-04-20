import uuid from 'uuid/v4'

import { InventoryItem, InventoryItemWithoutId } from '../models'
import { NotFound } from '../error'

export default class InventoryService {
  private items: { [farmName: string]: InventoryItem[] } = {
    'Bergerie de Bubertre': [
      {
        id: '1',
        title: 'Crottins de brebis BIO',
        category: 'Produits en lait BIO de brebis',
        price: 2.5,
        remaining: 80
      },
      {
        id: '2',
        title: 'Crottins de chèvre BIO',
        category: 'Produits en lait BIO de chèvres',
        price: 2.25,
        remaining: 80
      },
      {
        id: '3',
        title: 'Crottins de brebis',
        category: 'Produits en lait BIO de brebis',
        price: 2.5,
        remaining: 80
      }
    ]
  }

  public async getInventory (farmName: string): Promise<InventoryItem[]> {
    return this.items[farmName] || []
  }

  public async addItem (
    item: InventoryItemWithoutId,
    farmName: string
  ): Promise<InventoryItem> {
    const items = await this.getInventory(farmName)
    const finalItem = { ...item, id: uuid() }
    items.push(finalItem)
    return finalItem
  }

  public async updateItem (
    itemId: string,
    value: InventoryItemWithoutId,
    farmName: string
  ): Promise<void> {
    const items = await this.getInventory(farmName)
    const item = items.find(item => item.id === itemId)

    if (item !== undefined) {
      const index = items.indexOf(item)
      items[index] = { id: itemId, ...value }
    } else {
      throw new NotFound()
    }
  }

  public async deleteItem (itemId: string, farmName: string): Promise<void> {
    const items = await this.getInventory(farmName)
    const item = items.find(item => item.id === itemId)

    if (item !== undefined) {
      const index = items.indexOf(item)
      delete items[index]
    } else {
      throw new NotFound()
    }
  }
}
