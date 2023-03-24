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
        exIsActive,
        id
      } = req.body

      try {

        await conn.query('BEGIN')

        const updateQuery = pgPromise.as.format(`
            UPDATE public.examiners
            SET
              name=$1,
              code=$2,
              type=$3,
              compensate=$4,
              is_active=$5,
              last_updated=$6
            WHERE id = $7
            RETURNING *
          ;
        `,[
          exName,
          exCode,
          exType,
          exCompensate,
          exIsActive,
          new Date(),
          id
          ]
        )

        const updatedRecord = await conn.query(updateQuery)
        await conn.query('COMMIT')
        
        res.status(200).json({
          updatedRecord: updatedRecord.rows[0],
          message: 'Record Updated',
          status: 'success'
        })
        
      } catch ( error ) {
        await conn.query('ROLLBACK')
        console.log( error );
        res.status(400).json({
          message: 'Failed to update record',
          status: 'failure'
        })
      } 
    }
}

