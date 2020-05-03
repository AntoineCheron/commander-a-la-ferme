import { v4 as uuid } from 'uuid'
import { Pool } from 'pg'

import { FarmDetails, FarmDetailsWithoutId } from '../models'
import { NotFound } from '../error'
import { PsqlUtils } from '../utils'

export default class FarmService {
  constructor (private pool: Pool) {}

  public async getByName (farmName: string): Promise<FarmDetails> {
    try {
      const query = {
        text: SQL_QUERIES.FIND_FARM_BY_NAME,
        values: [PsqlUtils.toDbStr(farmName)]
      }
      const res = await this.pool.query(query)
      if (res.rowCount === 1) {
        const row = res.rows[0]
        return { ...row, paymentMethods: PsqlUtils.toArray(row.paymentmethods) }
      } else if (res.rowCount === 0) {
        throw new NotFound()
      } else {
        console.error(
          `Found more than one farm with name ${PsqlUtils.toDbStr(
            farmName
          )}. This should never happen. Please FIX.`
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

      await this.pool.query(query)
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
    'INSERT INTO farms(id, name, telephone, address, description, paymentMethods) SELECT $1, CAST($2 AS VARCHAR), $3, $4, $5, $6 WHERE NOT EXISTS (SELECT 1 FROM farms WHERE name=$2) RETURNING *;',
  FIND_FARM_BY_NAME:
    'SELECT id, name, telephone, address, description, paymentMethods FROM farms WHERE name=$1;',
  UPDATE_FARM:
    'UPDATE farms SET telephone=$2, address=$3, description=$4, paymentMethods=$5 WHERE name=$1;'
}
