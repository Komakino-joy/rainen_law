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
            FROM public.buyer_seller bs 
            WHERE bs.p_comp_ref = $1;
          `
        const result = await conn.query(getBuyerSellerInfoQuery, [req.body.p_comp_ref])
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
          res.status(400).json({
            message: 'Unable to fetch buyer/seller data.'
          })
      }
    }
}


