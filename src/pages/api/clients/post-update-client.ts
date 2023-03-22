import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 

      const {
        clientName='',
        searchName='', 
        addressLine1='', 
        addressLine2='', 
        city='',
        state='',
        zip='',
        phone='',
        fax='',
        contact='',
        status='', 
        statementAddressee='',
        email='',
        notes='',
        id
      } = req.body

      try {

        await conn.query('BEGIN')

        const addNewPropertyQuery = pgPromise.as.format(`
          UPDATE public."clntmstr" cm
          SET
            "CNAME" = $1,
            "CSEARCH" = $2,
            "CADD1" = $3,
            "CADD2" = $4,
            "CCITY" = $5,
            "CSTATE" = $6,
            "CZIP" = $7,
            "CPHONE" = $8,
            "CFAX" = $9,
            "CCNTCT" = $10,
            "CSTAT" = $11,
            "CSTATTO" = $12, 
            "CEMAIL" = $13,
            "CNOTES" = $14,
            "last_updated" = $15
          
          WHERE cm.id = $16
          RETURNING *;

        `,[
            clientName,
            searchName, 
            addressLine1, 
            addressLine2, 
            city,
            state,
            zip,
            phone,
            fax,
            contact,
            status, 
            statementAddressee,
            email,
            notes,
            new Date(),
            id,
          ]
        )

        const updatedRecord = await conn.query(addNewPropertyQuery)
        await conn.query('COMMIT')
        
        res.status(200).json({
          updatedRecord: updatedRecord.rows[0],
          message: 'Record updated',
          status: 'success'
        })
        
      } catch ( error ) {
        await conn.query('ROLLBACK')
        console.log( error );
        res.status(400).json({
          message: 'Failed to update record',
          status: 'error'
        })
      } 
    }
}

