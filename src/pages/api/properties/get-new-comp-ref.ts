import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "GET") { 
      try {  
        const newCompRefQuery = `
          SELECT MAX(pm."PCOMPREF") + 1 AS "COMPREF"
          FROM public."propmstr" pm;
        `
        const propertiesResults = (await conn.query(newCompRefQuery)).rows;
        res.status(200).send({
          newCompRef: propertiesResults[0].COMPREF
        })
        
      } catch ( error ) {
          console.log( error );
          res.status(400).send({message: 'Failed to get properties'})
      }
    }
}

