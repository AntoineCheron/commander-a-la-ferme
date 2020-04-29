import uuid from 'uuid/v4'
import { Pool } from 'pg'

import { FarmDetails, FarmDetailsWithoutId } from '../models'
import { NotFound } from '../error'
import { PsqlUtils } from '../utils'

export default class FarmService {
  // private farms: FarmDetails[] = [
  //   {
  //     id: '1',
  //     name: 'Bergerie de Bubertre',
  //     telephone: '02.02.02.02.02',
  //     address: 'Route de la bergerie, 61190 Bubertré',
  //     description: 'Bergerie qui vous propose des produits frais et bio',
  //     paymentMethods: ['Carte Bancaire']
  //   }
  // ]

  constructor (private pool: Pool) {}

  public async getByName (farmName: string): Promise<FarmDetails> {
    try {
      const query = {
        text: SQL_QUERIES.FIND_FARM_BY_NAME,
        values: [farmName]
      }
      const res = await this.pool.query(query)
      if (res.rowCount === 1) {
        const row = res.rows[0]
        return { ...row, paymentMethods: PsqlUtils.toArray(row.paymentMethods) }
      } else if (res.rowCount === 0) {
        throw new NotFound()
      } else {
        console.error(
          `Found more than one farm with name ${farmName}. This should never happen. Please FIX.`
        )
        throw new Error()
      }
    } catch (error) {
      // TODO: manage errors appropriately
      throw error
    }
  }

  public async create (farm: FarmDetailsWithoutId): Promise<void> {
    try {
      const query = {
        text: SQL_QUERIES.CREATE_FARM,
        values: [
          uuid(),
          farm.name,
          farm.telephone,
          farm.address,
          farm.description,
          PsqlUtils.formatArray(farm.paymentMethods)
        ]
      }
      const res = await this.pool.query(query)
      if (res.rowCount !== 1) {
        throw new Error()
      }
    } catch (error) {
      // TODO: manage errors appropriately
      throw error
    }
  }

  public async update (farm: FarmDetailsWithoutId): Promise<void> {
    try {
      const query = {
        text: SQL_QUERIES.UPDATE_FARM,
        values: [
          farm.name,
          farm.telephone,
          farm.address,
          farm.description,
          PsqlUtils.formatArray(farm.paymentMethods)
        ]
      }
      const res = await this.pool.query(query)
      if (res.rowCount === 0) {
        throw new NotFound()
      } else if (res.rowCount !== 1) {
        throw new Error()
      }
    } catch (error) {
      // TODO: manage errors appropriately
      throw error
    }
  }
}

const SQL_QUERIES = {
  CREATE_FARM:
    'INSERT INTO farms(id, name, telephone, address, description, paymentMethods) SELECT($1, $2, $3, $4, $5, $6) RETURNING * WHERE NOT EXISTS (SELECT $2 FROM farms WHERE name=$2);',
  FIND_FARM_BY_NAME:
    'SELECT id, name, telephone, address, description, paymentMethods FROM farms WHERE name=$1;',
  UPDATE_FARM:
    'UPDATE farm SET telephone=$2, address=$3, description=$4, paymentMethods=$5 WHERE name=$1;'
}
