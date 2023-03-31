import { TableRefs } from '@/types/common'
import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      const {
        id,
        code, 
        description,
        selectionType
      } = req.body

      console.log(req.body)
      try {
        await conn.query('BEGIN')

        let query = ''

        switch (selectionType as TableRefs) {
          case 'pType':
            query= 'UPDATE prop_types SET type_code=$1, type_desc=$2 WHERE id = $3 RETURNING *;'
            break;
          case 'clientStat':
            query= 'UPDATE client_status SET status_code=$1, status_desc=$2 WHERE id = $3 RETURNING *;'
            break;
          case 'pStat':
            query= 'UPDATE prop_status SET status_code=$1, status_desc=$2 WHERE id = $3 RETURNING *;'
            break;
          case 'counties':
            query= 'UPDATE counties SET code=$1, county=$2 WHERE id = $3 RETURNING *;'
            break; 
          default:
            break;
        }

        const updateStatusCodeQuery = pgPromise.as.format(query, [code, description, id])

        const updatedRecord = await conn.query(updateStatusCodeQuery)
        await conn.query('COMMIT')

        res.status(200).json({
          updatedRecord: updatedRecord.rows[0],
          message: 'Record updated',
          status: 'success'
        })
        
      } catch ( error ) {
        await conn.query('ROLLBACK')
        console.log( error );
        res.status(400).json({
          message: 'Failed to update record',
          status: 'error'
        })
      } 
    }
}

