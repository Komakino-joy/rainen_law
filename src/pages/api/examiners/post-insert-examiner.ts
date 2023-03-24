import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      const {
        exName,
        exCode,
        exType,
        exCompensate,
        exIsActive
      } = req.body

      try {

        await conn.query('BEGIN')

        const insertQuery = pgPromise.as.format(`
            INSERT INTO public.examiners
            (
              name,
              code,
              type,
              compensate,
              is_active,
              created_at,
              last_updated
            )
            VALUES (
              $1, $2, $3, 
              $4, $5, $6, $7
            )

            RETURNING *
          ;
        `,[
            exName,
            exCode,
            exType,
            exCompensate,
            exIsActive,
            new Date(),
            new Date(),
          ]
        )

        const newRecord = await conn.query(insertQuery)
        await conn.query('COMMIT')
        
        res.status(200).json({
          newRecord: newRecord.rows[0],
          message: 'New record inserted',
          status: 'success'
        })
        
      } catch ( error ) {
        await conn.query('ROLLBACK')
        console.log( error );
        res.status(400).json({
          newPropId: null,
          message: 'Failed to insert record',
          status: 'failure'
        })
      } 
    }
}

