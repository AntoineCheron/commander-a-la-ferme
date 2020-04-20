import { Farm } from '../models'
import Http from './Http'

export default class FormService {
  static async getInventoryOfFarm (farmName: string): Promise<Farm> {
    const response = await Http.instance().get(`/public-inventory/${farmName}`)
    return response.data as Farm
  }
}
