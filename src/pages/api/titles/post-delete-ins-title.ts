import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      const {
        id
      } = req.body
      
      try {
        await conn.query('BEGIN')
        const deletePropertyQuery = pgPromise.as.format(`
          DELETE FROM public.ins ins WHERE ins.id = $1;
        `,[id]
        )
        await conn.query(deletePropertyQuery)
        await conn.query('COMMIT')
        
        res.status(200).json({
          message: `Policy: ${id} successfully removed.`,
          status: 'success'
        })
        
      } catch ( error ) {
        await conn.query('ROLLBACK')
        console.log( error );
        res.status(400).json({
          newId: null,
          message: 'Failed to delete record',
          status: 'error'
        })
      } 
    }
}

