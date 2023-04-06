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
        c_statement_addressee,
        c_email,
        c_notes,
        created_by,
        last_updated_by,
      } = req.body

      try {

        await conn.query('BEGIN')

        // Need to get the latest c_number + 1 so we can assign it to the new Client
        const newCNumberQuery = `
          SELECT MAX(c.${dbRefs.clients.c_number}) 
          FROM ${dbRefs.table_names.clients} c;`
        const clientIdResponse = await conn.query(newCNumberQuery)
        const newCNumber = clientIdResponse.rows[0].max + 1

        const addNewClientQuery = pgPromise.as.format(`
          INSERT INTO ${dbRefs.table_names.clients}
          (
            c.${dbRefs.clients.c_number},
            c.${dbRefs.clients.c_name},
            c.${dbRefs.clients.c_address_1},
            c.${dbRefs.clients.c_address_2},
            c.${dbRefs.clients.c_city},
            c.${dbRefs.clients.c_state},
            c.${dbRefs.clients.c_zip},
            c.${dbRefs.clients.c_phone},
            c.${dbRefs.clients.c_fax},
            c.${dbRefs.clients.c_contact},
            c.${dbRefs.clients.c_status},
            c.${dbRefs.clients.c_statement_addresse}, 
            c.${dbRefs.clients.c_email},
            c.${dbRefs.clients.c_notes},
            c.${dbRefs.clients.created_by},
            c.${dbRefs.clients.last_updated_by},
            c.${dbRefs.clients.last_updated}
            c.${dbRefs.clients.created_at}
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
            $12, $13, $14, $15, $16, $17, $18)

            RETURNING *
          ;
        `,[
            newCNumber,
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
            c_statement_addressee,
            c_email,
            c_notes,
            created_by,
            last_updated_by,
            new Date(),
            new Date(),
          ]
        )

        const newRecord = await conn.query(addNewClientQuery)
        await conn.query('COMMIT')
        
        res.status(200).json({
          newClientId: newRecord.rows[0].id,
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

