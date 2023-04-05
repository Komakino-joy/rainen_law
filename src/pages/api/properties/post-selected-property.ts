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
            bs."seller_1",
            bs."seller_2",
            bs."seller_3",
            bs."seller_4",
            bs."buyer_1",
            bs."buyer_2"
          FROM public.properties pm
          LEFT JOIN public.clntmstr cm
            ON cm."CNMBR" = pm.p_number
          LEFT JOIN buyer_seller bs 
            ON bs.p_comp_ref = pm.p_comp_ref
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

