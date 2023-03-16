import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 

      const { propertyId } = req.body

      try {
        const propertiesQuery = pgPromise.as.format(`
          SELECT 
            pm.*, 
            cm."CNAME",  
            cm."CNMBR"
          FROM public.propmstr pm
          LEFT JOIN public.clntmstr cm
          ON cm."CNMBR" = pm."PNMBR"
          WHERE pm."PROPID" = $1
          ;
        `,[propertyId]
        )
        
        const propertiesResults = (await conn.query(propertiesQuery)).rows    
        res.status(200).json(propertiesResults)

      } catch ( error ) {
          console.log( error );
      }
    }
}

