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
        selectionType
      } = req.body

      try {
        await conn.query('BEGIN')

        let query = ''

        switch (selectionType as TableRefs) {
          case 'pType':
            query= 'DELETE FROM prop_types WHERE id = $1;'
            break;
          case 'clientStat':
            query= 'DELETE FROM client_status WHERE id = $1;'
            break;
          case 'insTitleStat':
            query= 'DELETE FROM ins_status WHERE id = $1;'
            break;
          case 'pStat':
            query= 'DELETE FROM prop_status WHERE id = $1;'
            break;
          case 'counties':
            query= 'DELETE FROM counties id = $1;'
            break; 
          default:
            break;
        }

        const deleteQuery = pgPromise.as.format(query, [id])

        await conn.query(deleteQuery)

        await conn.query('COMMIT')

        res.status(200).json({
          message: `${selectionType}: ${id} successfully removed.`,
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

