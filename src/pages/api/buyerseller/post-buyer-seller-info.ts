import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      try {
        const getBuyerSellerInfoQuery = `
            SELECT * 
            FROM public.buysell bs 
            WHERE bs."PCOMPREF" = $1;
          `
        const result = await conn.query(getBuyerSellerInfoQuery, [req.body.PCOMPREF])
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


