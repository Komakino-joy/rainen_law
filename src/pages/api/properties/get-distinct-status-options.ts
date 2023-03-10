
import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "GET") { 
      try {
        const getDistinctTypes = `
            SELECT DISTINCT pm."PSTAT" 
            FROM public.propmstr pm 
            WHERE pm."PSTAT" IS NOT NULL
            ORDER BY pm."PSTAT" ASC;
          `
        const result = await conn.query(getDistinctTypes)
        
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


