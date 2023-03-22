import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "GET") { 
      try {
        const getLatestInsTitles = `
            SELECT *
            FROM public.ins ins
            LEFT JOIN public.companies comp
            ON ins."TITLECO" = comp.tnmbr
            ORDER BY 
              ins.last_updated,
              ins.created_at,
              ins."IPOLDATE"
            LIMIT 10
          ;`
        const result = await conn.query(getLatestInsTitles)
  
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


