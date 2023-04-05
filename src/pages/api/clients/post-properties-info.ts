import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      try {
        const getClientPropertyInfoQuery = `
            SELECT * 
            FROM public.properties pm 
            WHERE pm.p_number = $1
            ORDER BY 
              pm.p_input_date DESC,
              pm.p_city,
              pm.p_street;
          `
        const result = await conn.query(getClientPropertyInfoQuery, [req.body.CNMBR])
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


