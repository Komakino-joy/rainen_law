import dbRefs from '@/constants/dbRefs'
import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 

      const {
        c_name,
        c_address_1, 
        c_address_2, 
        c_city,
        c_state,
        c_zip,
        c_phone,
        c_fax,
        c_contact,
        c_status, 
        c_statement_addresseee,
        c_email,
        c_notes,
        last_updated_by,
        c_id
      } = req.body

      try {

        await conn.query('BEGIN')

        const addNewPropertyQuery = pgPromise.as.format(`
          UPDATE ${dbRefs.table_names.clients} c
          SET
            c.${dbRefs.clients.c_name} = $1,
            c.${dbRefs.clients.c_address_1} = $2,
            c.${dbRefs.clients.c_address_2} = $3,
            c.${dbRefs.clients.c_city} = $4,
            c.${dbRefs.clients.c_state} = $5,
            c.${dbRefs.clients.c_zip} = $6,
            c.${dbRefs.clients.c_phone} = $7,
            c.${dbRefs.clients.c_fax} = $8,
            c.${dbRefs.clients.c_contact} = $9,
            c.${dbRefs.clients.c_status} = $10,
            c.${dbRefs.clients.c_statement_addressee} = $11, 
            c.${dbRefs.clients.c_email} = $12,
            c.${dbRefs.clients.c_notes} = $13,
            c.${dbRefs.clients.last_updated_by} = $14,
            c.${dbRefs.clients.last_updated} = $15
          
          WHERE c.${dbRefs.clients.id} = $16
          RETURNING *;

        `,[
            c_name,
            c_address_1, 
            c_address_2, 
            c_city,
            c_state,
            c_zip,
            c_phone,
            c_fax,
            c_contact,
            c_status, 
            c_statement_addresseee,
            c_email,
            c_notes,
            last_updated_by,
            new Date(),
            c_id,
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

