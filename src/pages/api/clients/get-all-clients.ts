import dbRefs from '@/constants/dbRefs'
import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "GET") { 
      try {
        const getAllClientsQuery = `
            SELECT * FROM
              ${dbRefs.table_names.clients} c
            WHERE 
              c.${dbRefs.clients.c_name} IS NOT NULL
            ORDER BY
              c.${dbRefs.clients.last_updated} DESC,
              c.${dbRefs.clients.c_name} ASC,
              c.${dbRefs.clients.id};
          `
        const result = await conn.query(getAllClientsQuery)
  
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


