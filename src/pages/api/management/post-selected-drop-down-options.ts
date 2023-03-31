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

        let query = ''

        switch (selectionType as TableRefs) {
          case 'pType':
            query= 'SELECT * FROM prop_types WHERE id = $1'
            break;
          case 'clientStat':
            query= 'SELECT * FROM client_status WHERE id = $1'
            break;
          case 'pStat':
            query= 'SELECT * FROM prop_status WHERE id = $1'
            break;
          case 'counties':
            query= 'SELECT * FROM counties WHERE id = $1'
            break; 
          default:
            break;
        }

        const selectStatusCodeQuery = pgPromise.as.format(query, [id])

        const results = await conn.query(selectStatusCodeQuery)
         
        res.status(200).json(results.rows)

      } catch ( error ) {
          console.log( error );
      }
    }
}

