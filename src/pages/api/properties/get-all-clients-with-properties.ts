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
              cm."CNAME"
            FROM
              public.clntmstr cm
            INNER JOIN public.properties pm 
            ON cm."CNMBR" = pm.p_number
            WHERE 
              cm."CNAME" IS NOT NULL
            ORDER BY
              "CNAME" ASC
              LIMIT 50;
          `
        const result = await conn.query(getAllClientsQuery)
  
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


