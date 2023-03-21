import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "GET") { 
      try {
        const getAllINSTitlesQuery = `
            SELECT
              comp.tticoname,
              ins."INMBR",
              ins."IREMIT",
              ins."ISTAT",
              ins."ISTATE",
              ins."IZIP",
              ins."TITLECO",
              ins."ICITY"
            FROM public.ins ins
            LEFT JOIN public.companies comp
            ON ins."TITLECO" = comp.tnmbr
          ;`
        const result = await conn.query(getAllINSTitlesQuery)
  
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


