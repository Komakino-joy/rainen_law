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
        c_name='',
        c_number='',
        c_city='',
        c_contact='',
        c_email='',
        c_fax='',
        c_phone='',
        c_status='',
        c_state='',
        c_statement_addresse='',
        c_zip=''
      } = req.body

      const andEqualsClause = (table:string, field:string, paramNum:string) => {
        return `AND ${table}."${field}" = $${paramNum}`
      }

      const param = {
        c_name: c_name !== '' ? andEqualsClause('c',dbRefs.clients.c_name, '1') : '',
        c_number: c_number !== '' ? andEqualsClause('c',dbRefs.clients.c_number, '2') : '',
        c_city: c_city !== '' ? andEqualsClause('c', dbRefs.clients.c_city, '3') : '',
        c_contact: c_contact !== '' ? andEqualsClause('c', dbRefs.clients.c_contact, '4') : '',
        c_email: c_email !== '' ? andEqualsClause('c', dbRefs.clients.c_email, '5') : '',
        c_fax: c_fax !== '' ? andEqualsClause('c', dbRefs.clients.c_fax, '6') : '',
        c_phone: c_phone !== '' ? andEqualsClause('c', dbRefs.clients.c_phone, '7') : '',
        c_status: c_status !== '' ? andEqualsClause('c', dbRefs.clients.c_status, '8') : '',
        c_state: c_state !== '' ? andEqualsClause('c', dbRefs.clients.c_state, '9') : '',
        c_statement_addresse: c_statement_addresse !== '' ? andEqualsClause('c', dbRefs.clients.c_statement_addresse, '10') : '',
        c_zip: c_zip !== '' ? andEqualsClause('c', dbRefs.clients.c_zip, '11') : '',
      }

      console.log(param)
      try {
        const clientsQuery = pgPromise.as.format(`
            SELECT 
              c.${dbRefs.clients.id},
              c.${dbRefs.clients.c_name},
              c.${dbRefs.clients.c_number},
              c.${dbRefs.clients.c_address_1},
              c.${dbRefs.clients.c_address_2},
              c.${dbRefs.clients.c_city},
              c.${dbRefs.clients.c_state},
              c.${dbRefs.clients.c_zip},
              c.${dbRefs.clients.c_phone},
              c.${dbRefs.clients.c_fax},
              c.${dbRefs.clients.c_is_client},
              COALESCE(pc."PROPCOUNT", 0) as "PROPCOUNT",
              COALESCE(i."TITLESCOUNT", 0) as "TITLESCOUNT"
            FROM ${dbRefs.table_names.clients} c
            LEFT JOIN (
                SELECT 
                    p.${dbRefs.properties.p_number}, 
                    COUNT(*) AS "PROPCOUNT" 
                FROM ${dbRefs.table_names.properties} p
                GROUP BY p.${dbRefs.properties.p_number}
            ) pc ON pc.${dbRefs.properties.p_number} = c.${dbRefs.clients.c_number}
            LEFT JOIN (
                SELECT 
                    i."INMBR", 
                    COUNT(*) AS "TITLESCOUNT" 
                FROM public.ins i
                GROUP BY i."INMBR"
            ) i ON i."INMBR" = c.c_number
  
          WHERE 
            c.${dbRefs.clients.id} IS NOT NULL
            ${param.c_name}
            ${param.c_number}
            ${param.c_city}
            ${param.c_contact}
            ${param.c_email}
            ${param.c_fax}
            ${param.c_phone}
            ${param.c_status}
            ${param.c_state}
            ${param.c_statement_addresse}
            ${param.c_zip}
          ORDER BY 
            c.${dbRefs.clients.c_name}
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
            c_statement_addresse,
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

