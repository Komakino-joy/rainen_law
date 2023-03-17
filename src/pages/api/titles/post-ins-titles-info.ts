import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      try {
        const getInsTitlesInfoQuery = `
            SELECT 
              i."ISTRET",
              i."ICITY",
              i."ILOT",
              i."ICONDO",
              i."IUNIT"
            FROM public.ins i 
            WHERE i."INMBR" = $1;
          `
        const result = await conn.query(getInsTitlesInfoQuery, [req.body.inmbr])

        res.status(200).json({
          titles: result.rows,
          count: result.rowCount
        })
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


