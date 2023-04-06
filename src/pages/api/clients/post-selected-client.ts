import dbRefs from '@/constants/dbRefs'
import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 

      const { clientId } = req.body

      try {
        const clientByIdQuery = pgPromise.as.format(`
          SELECT 
            * 
          FROM 
            ${dbRefs.table_names.clients} 
          WHERE 
            ${dbRefs.clients.id} = $1;
        `,[clientId]
        )
        
        const clientByIdResults = (await conn.query(clientByIdQuery)).rows    
        res.status(200).json(clientByIdResults)

      } catch ( error ) {
          console.log( error );
      }
    }
}

