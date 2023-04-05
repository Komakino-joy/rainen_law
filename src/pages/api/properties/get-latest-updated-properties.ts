import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "GET") { 
      
      try {    
        const allProperties = `
          SELECT 
            cm."CNAME",
            pm.p_input_date,
            pm.p_city,
            pm.p_street,
            pm.p_lot,
            pm.p_condo,
            pm.p_unit,
            pm.p_number,
            pm.p_requester,
            pm.p_type,
            pm.p_status,
            pm.p_comp_ref,
            pm.p_instructions,
            pm.id
          FROM public."properties" pm
          LEFT JOIN public."clntmstr" cm 
          ON cm."CNMBR" = pm.p_number
          ORDER BY 
            pm.last_updated DESC,
            pm.p_input_date DESC,
            pm.id
          LIMIT 10
        `
        const propertiesResults = (await conn.query(allProperties)).rows;
    
        res.status(200).send(propertiesResults)
        
      } catch ( error ) {
          console.log( error );
          res.status(400).send({message: 'Failed to get properties'})
      }
    }
}

