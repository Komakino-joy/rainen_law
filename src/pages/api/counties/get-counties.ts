import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "GET") { 
      try {
        const getAllCountiesQuery = `SELECT * FROM public.counties;`
        const result = await conn.query(getAllCountiesQuery)
  
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


