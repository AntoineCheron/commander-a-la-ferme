import { InventoryItem } from '../models'
import Http from './Http'

export default class InventoryService {
  public async getInventory (): Promise<InventoryItem[]> {
    const response = await Http.instance().get('/inventory')
    return response.data.inventory
  }

  public async create (item: InventoryItem): Promise<InventoryItem> {
    const copy = Object.assign({}, item)
    delete copy['id']
    const response = await Http.instance().post('/inventory', copy)
    return response.data
  }

  public async update (item: InventoryItem): Promise<void> {
    const copy = Object.assign({}, item)
    delete copy['id']
    await Http.instance().put(`/inventory/${item.id}`, copy)
  }

  public async updateCategoryName (
    previousName: string,
    newName: string
  ): Promise<void> {
    await Http.instance().put('/inventory/category', { previousName, newName })
  }
}
