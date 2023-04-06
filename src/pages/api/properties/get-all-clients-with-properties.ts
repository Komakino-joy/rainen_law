import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "GET") { 
      try {
        const getAllClientsQuery = `
            SELECT DISTINCT
              cm.c_name
            FROM
              ${dbRefs.table_names.clients} cm
            INNER JOIN ${dbRefs.table_names.properties} pm 
            ON cm.c_number = pm.p_number
            WHERE 
              cm.c_name IS NOT NULL
            ORDER BY
              c_name ASC
              LIMIT 50;
          `
        const result = await conn.query(getAllClientsQuery)
  
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


