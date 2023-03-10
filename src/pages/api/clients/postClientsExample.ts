// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      try {
        const query = `select * from public."tblClients"`
        const values = [req.body.content]

        const result = await conn.query(
            query,
            values
        );
          console.log( "ttt",result );
          res.status(200).json({ name: 'John Doe' })
      } catch ( error ) {
          console.log( error );
      }
    }
}


