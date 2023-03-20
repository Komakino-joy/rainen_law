import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      const { insTitleId } = req.body

      try {
        const insTitlesQuery = pgPromise.as.format(`
            SELECT 
              ins.*, 
              comp.tticoname  
            FROM public.ins ins
            LEFT JOIN public.companies comp
            ON ins."TITLECO" = comp."tnmbr"
            WHERE ins.id = $1
          ; 
        `,[insTitleId]
        )
        
        const propertiesResults = (await conn.query(insTitlesQuery)).rows    
        res.status(200).json(propertiesResults)

      } catch ( error ) {
          console.log( error );
      }
    }
}

