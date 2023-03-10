
import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "GET") { 
      try {
        const getDistinctCities = `
            SELECT DISTINCT pm."PCITY" 
            FROM public.propmstr pm 
            ORDER BY pm."PCITY";
          `
        const result = await conn.query(getDistinctCities)
        
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


