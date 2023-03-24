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

        const updateQuery = pgPromise.as.format(`
            UPDATE public.companies
            SET
              tticoname=$1,
              abbr=$2,
              tadd1=$3,
              tcity=$4,
              tstate=$5,
              tzip=$6,
              tstat=$7,
              tpercent=$8,
              tproduct1=$9,
              tproduct2=$10,
              tproduct3=$11,
              tproduct4=$12,
              last_updated=$13

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

