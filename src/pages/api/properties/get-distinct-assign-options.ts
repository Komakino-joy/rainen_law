
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
            DISTINCT pm.p_assign 
            FROM public."properties" pm 
            WHERE pm.p_assign IS NOT NULL 
            ORDER BY pm.p_assign;
          `
        const result = await conn.query(getDistinctAssign)
        
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


