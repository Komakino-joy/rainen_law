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
            cm."CNMBR",
            bs."PSELR1",
            bs."PSELR2",
            bs."PSELR3",
            bs."PSELR4",
            bs."PBUYR1",
            bs."PBUYR2"
          FROM public.propmstr pm
          LEFT JOIN public.clntmstr cm
            ON cm."CNMBR" = pm."PNMBR"
          LEFT JOIN buysell bs 
            ON bs."PCOMPREF" = pm."PCOMPREF"
          WHERE pm.id = $1
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

