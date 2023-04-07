import dbRef from '@/constants/dbRefs'
import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      const {
        [dbRef.examiners.name]: name,
        [dbRef.examiners.code]: code,
        [dbRef.examiners.type]: type,
        [dbRef.examiners.compensate]: compensate,
        [dbRef.examiners.is_active]: is_active,
        [dbRef.examiners.id]: id
      } = req.body
      try {
        await conn.query('BEGIN')

        const updateQuery = pgPromise.as.format(`
            UPDATE ${dbRef.table_names.examiners}
            SET
              ${dbRef.examiners.name}=$1,
              ${dbRef.examiners.code}=$2,
              ${dbRef.examiners.type}=$3,
              ${dbRef.examiners.compensate}=$4,
              ${dbRef.examiners.is_active}=$5,
              ${dbRef.examiners.last_updated}=$6
            WHERE ${dbRef.examiners.id} = $7
            RETURNING *
          ;
        `,[
            name,
            code,
            type,
            compensate,
            is_active,
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

