
import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "GET") { 
      try {
        const getDistinctTypes = `
            SELECT DISTINCT pm."PTYPE" 
            FROM public.propmstr pm 
            WHERE pm."PTYPE" IS NOT NULL
            ORDER BY pm."PTYPE" ASC;
          `
        const result = await conn.query(getDistinctTypes)
        
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


