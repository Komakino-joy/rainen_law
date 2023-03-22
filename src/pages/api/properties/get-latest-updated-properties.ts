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
            pm."PTDATE",
            pm."PCITY",
            pm."PSTRET",
            pm."PLOT",
            pm."PCONDO",
            pm."PUNIT",
            pm."PNMBR",
            pm."PREQ",
            pm."PTYPE",
            pm."PSTAT",
            pm."PCOMPREF",
            pm."PINSTR",
            pm.id
          FROM public."propmstr" pm
          LEFT JOIN public."clntmstr" cm 
          ON cm."CNMBR" = pm."PNMBR"
          ORDER BY 
            pm.last_updated DESC,
            pm."PTDATE" DESC,
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

