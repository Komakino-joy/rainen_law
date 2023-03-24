import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      const {
        companyName, 
        companyAbbr,
        address,
        city,
        state,
        zipCode,
        status,
        percent,
        product1,
        product2,
        product3,
        product4
      } = req.body

      try {

        await conn.query('BEGIN')

        const insertQuery = pgPromise.as.format(`
            INSERT INTO public.companies
            (
              tticoname,
              abbr,
              tadd1,
              tcity,
              tstate,
              tzip,
              tstat,
              tpercent,
              tproduct1,
              tproduct2,
              tproduct3,
              tproduct4,
              created_at,
              last_updated
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, 
              $9, $10, $11, $12, $13, $14
            )

            RETURNING *
          ;
        `,[
            companyName,
            companyAbbr,
            address,
            city,
            state,
            zipCode,
            status,
            percent,
            product1,
            product2,
            product3,
            product4,
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

