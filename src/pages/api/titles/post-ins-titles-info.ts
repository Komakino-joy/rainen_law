import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      try {
        const getBuyerSellerInfoQuery = `
            SELECT 
              i."ISTRET",
              i."ICITY",
              i."ILOT",
              i."ICONDO",
              i."IUNIT"
            FROM public.ins i 
            WHERE i."INMBR" = $1;
          `
        const result = await conn.query(getBuyerSellerInfoQuery, [req.body.PNMBR])

        res.status(200).json({
          titles: result.rows,
          count: result.rowCount
        })
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


