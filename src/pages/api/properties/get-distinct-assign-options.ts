
import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "GET") { 
      try {
        const getDistinctAssign = `
            SELECT 
            DISTINCT pm."PASIGN" 
            FROM public."propmstr" pm 
            WHERE pm."PASIGN" IS NOT NULL 
            ORDER BY pm."PASIGN";
          `
        const result = await conn.query(getDistinctAssign)
        
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


