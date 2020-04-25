import uuid from 'uuid/v4'

import { FarmDetails, FarmDetailsWithoutId } from '../models'
import { NotFound } from '../error'

export default class FarmService {
  private farms: FarmDetails[] = [
    {
      id: '1',
      name: 'Bergerie de Bubertre',
      telephone: '02.02.02.02.02',
      address: 'Route de la bergerie, 61190 Bubertré',
      description: 'Bergerie qui vous propose des produits frais et bio',
      paymentMethods: ['Carte Bancaire']
    }
  ]

  public async getByName (farmName: string): Promise<FarmDetails> {
    const maybeFarm = this.farms.find(farm => farm.name === farmName)
    if (maybeFarm !== undefined) {
      return maybeFarm
    } else {
      throw new NotFound()
    }
  }

  public async create (farm: FarmDetailsWithoutId): Promise<void> {
    this.farms.push({ ...farm, id: uuid() })
  }

  public async update (farm: FarmDetailsWithoutId): Promise<void> {
    const existingFarm = this.farms.find(f => f.name === farm.name)

    if (existingFarm !== undefined) {
      const index = this.farms.indexOf(existingFarm)
      this.farms[index] = { ...existingFarm, ...farm }
    } else {
      throw new NotFound()
    }
  }
}
