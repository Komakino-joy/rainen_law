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
        c_name='',
        c_number='',
        c_city='',
        c_contact='',
        c_email='',
        c_fax='',
        c_phone='',
        c_status='',
        c_state='',
        c_statement_addressee='',
        c_zip=''
      } = req.body

      const andEqualsClause = (table:string, field:string, paramNum:string) => {
        return `AND ${table}."${field}" = $${paramNum}`
      }

      const param = {
        c_name: c_name !== '' ? andEqualsClause('c',dbRef.clients.c_name, '1') : '',
        c_number: c_number !== '' ? andEqualsClause('c',dbRef.clients.c_number, '2') : '',
        c_city: c_city !== '' ? andEqualsClause('c', dbRef.clients.c_city, '3') : '',
        c_contact: c_contact !== '' ? andEqualsClause('c', dbRef.clients.c_contact, '4') : '',
        c_email: c_email !== '' ? andEqualsClause('c', dbRef.clients.c_email, '5') : '',
        c_fax: c_fax !== '' ? andEqualsClause('c', dbRef.clients.c_fax, '6') : '',
        c_phone: c_phone !== '' ? andEqualsClause('c', dbRef.clients.c_phone, '7') : '',
        c_status: c_status !== '' ? andEqualsClause('c', dbRef.clients.c_status, '8') : '',
        c_state: c_state !== '' ? andEqualsClause('c', dbRef.clients.c_state, '9') : '',
        c_statement_addressee: c_statement_addressee !== '' ? andEqualsClause('c', dbRef.clients.c_statement_addressee, '10') : '',
        c_zip: c_zip !== '' ? andEqualsClause('c', dbRef.clients.c_zip, '11') : '',
      }

      try {
        const clientsQuery = pgPromise.as.format(`
            SELECT 
              c.${dbRef.clients.id},
              c.${dbRef.clients.c_name},
              c.${dbRef.clients.c_number},
              c.${dbRef.clients.c_address_1},
              c.${dbRef.clients.c_address_2},
              c.${dbRef.clients.c_city},
              c.${dbRef.clients.c_state},
              c.${dbRef.clients.c_zip},
              c.${dbRef.clients.c_phone},
              c.${dbRef.clients.c_fax},
              COALESCE(pc.propcount, 0) as propcount,
              COALESCE(icount.titlescount, 0) as titlescount
            FROM ${dbRef.table_names.clients} c
            LEFT JOIN (
              SELECT 
                p.${dbRef.properties.p_number}, 
                COUNT(*) AS propcount 
              FROM ${dbRef.table_names.properties} p
              GROUP BY p.${dbRef.properties.p_number}
            ) pc ON pc.${dbRef.properties.p_number} = c.${dbRef.clients.c_number}
            LEFT JOIN (
              SELECT 
                ${dbRef.insurance_titles.i_number}, 
                COUNT(*) AS titlescount 
              FROM ${dbRef.table_names.insurance_titles}
              GROUP BY ${dbRef.insurance_titles.i_number}
            ) icount ON icount.${dbRef.insurance_titles.i_number} = c.${dbRef.clients.c_number}
  
          WHERE 
            c.${dbRef.clients.id} IS NOT NULL
            ${param.c_name}
            ${param.c_number}
            ${param.c_city}
            ${param.c_contact}
            ${param.c_email}
            ${param.c_fax}
            ${param.c_phone}
            ${param.c_status}
            ${param.c_state}
            ${param.c_statement_addressee}
            ${param.c_zip}
          ORDER BY 
            c.${dbRef.clients.c_name}
          ;
        `,[
            c_name,
            c_number,
            c_city,
            c_contact,
            c_email,
            c_fax,
            c_phone,
            c_status,
            c_state,
            c_statement_addressee,
            c_zip
          ]
        )
        
        const clientsResults = (await conn.query(clientsQuery)).rows
        res.status(200).json(clientsResults)

      } catch ( error ) {
          console.log( error );
      }
    }
}

