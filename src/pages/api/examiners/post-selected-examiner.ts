import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 

      const { id } = req.body

      try {
        const selectQuery = pgPromise.as.format(`
          SELECT * FROM public.examiners 
          WHERE id = $1;
        `,[id]
        )
        
        const queryResults = (await conn.query(selectQuery)).rows    
        res.status(200).json(queryResults)

      } catch ( error ) {
          console.log( error );
      }
    }
}

