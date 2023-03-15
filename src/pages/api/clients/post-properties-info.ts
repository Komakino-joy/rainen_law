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
            FROM public.propmstr pm 
            WHERE pm."PNMBR" = $1;
          `
        const result = await conn.query(getClientPropertyInfoQuery, [req.body.CNMBR])
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


