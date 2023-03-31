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
        code, 
        description,
        selectionType
      } = req.body

      try {
        await conn.query('BEGIN')

        let query = ''

        switch (selectionType as TableRefs) {
          case 'pType':
            query= 'INSERT INTO prop_types (type_code, type_desc) VALUES ($1, $2) RETURNING *;'
            break;
          case 'clientStat':
            query= 'INSERT INTO client_status (status_code, status_desc) VALUES ($1, $2) RETURNING *;'
            break;
          case 'pStat':
            query= 'INSERT INTO prop_status (status_code, status_desc) VALUES ($1, $2) RETURNING *;'
            break;
          case 'counties':
            query= 'INSERT INTO counties (code, county) VALUES ($1, $2) RETURNING *;'
            break; 
          default:
            break;
        }

        const addNewStatusQuery = pgPromise.as.format(query,[code, description])

        const newRecord = await conn.query(addNewStatusQuery)
        await conn.query('COMMIT')

        res.status(200).json({
          newRecord: newRecord.rows[0],
          message: 'New record inserted',
          status: 'success'
        })
        
      } catch ( error ) {
        await conn.query('ROLLBACK')
        if((error as any).code === '23505') {
          res.status(400).json({
            message: 'Record with the same code already exists.',
            status: 'error'
          })
        } else {
          res.status(400).json({
            message: 'Failed to insert record',
            status: 'error'
          })
        }
      } 
    }
}

