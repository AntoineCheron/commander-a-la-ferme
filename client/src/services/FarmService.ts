import Http from './Http'
import { Farm, PaymentMethod } from '../models'

export default class FarmService {
  public async update (
    farmName: string,
    telephone: string,
    address: string,
    paymentMethods: PaymentMethod[],
    description: string
  ): Promise<void> {
    await Http.instance().put(`/farm/${farmName}`, {
      telephone,
      address,
      paymentMethods,
      description
    })
  }

  static async getInventoryOfFarm (farmName: string): Promise<Farm> {
    const response = await Http.instance().get(`/public-inventory/${farmName}`)
    return response.data as Farm
  }
}
