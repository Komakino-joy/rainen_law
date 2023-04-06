import dbRef from '@/constants/dbRefs'
import { timestampToDate } from '@/utils'
import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 

      let {
        p_city='', 
        p_street='', 
        p_lot='', 
        p_condo='', 
        p_instructions='',
        c_name='', 
        p_type='', 
        p_status='',
        p_comp_ref='',
        p_file='',
        inputStartDate='',
        inputEndDate,
        requestStartDate='',
        requestEndDate=''
      } = req.body

      if(inputStartDate !== '' && inputEndDate === '') {
        inputEndDate = timestampToDate(Date(), 'mmDDyyyy').date 
      }

      if(requestStartDate !== '' && requestEndDate === '') {
        requestEndDate = timestampToDate(Date(), 'mmDDyyyy').date 
      }

      const andLikeClause = (table:string, field:string, paramNum:string) => {
        return `AND LOWER(${table}."${field}") LIKE '%' || $${paramNum} || '%'`
      }
      
      const andEqualsClause = (table:string, field:string, paramNum:string) => {
        return `AND ${table}."${field}" = $${paramNum}`
      }

      const andBetweenClause = (table:string, field:string, startParam:string, endParam:string) => {
        return `AND ${table}."${field}" BETWEEN DATE($${startParam}) AND DATE($${endParam})`
      }

      const param = {
        p_city: p_city !== '' ? andEqualsClause('p','p_city', '1') : '',
        p_street: p_street !== '' ? andLikeClause('p','p_street', '2') : '',
        p_lot: p_lot !== '' ? andLikeClause('p','p_lot', '3') : '',
        p_condo: p_condo !== '' ? andLikeClause('p','p_condo', '4'): '',
        p_instructions: p_instructions !== '' ? andLikeClause('p','p_instructions', '5') : '',
        c_name: c_name !== '' ? andEqualsClause('c','c_name', '6') : '',
        p_type: p_type !== '' ? andEqualsClause('p','p_type', '7') : '',
        p_status: p_status !== '' ? andEqualsClause('p','p_status', '8'): '',
        p_comp_ref: p_comp_ref !== '' ? andEqualsClause('p','p_comp_ref', '9'): '',
        p_file: p_file !== '' ? andEqualsClause('p','p_file', '10'): '',
        inputDateRange: inputStartDate !== '' && inputEndDate !== '' ? andBetweenClause('p','p_input_date', '11', '12'): '',
        requestDateRange: requestStartDate !== '' && requestEndDate !== '' ? andBetweenClause('p','p_request_date', '13', '14'): '',
      }

      try {
        const propertiesQuery = pgPromise.as.format(`
          SELECT
            c.${dbRef.clients.c_name},  
            c.${dbRef.clients.c_number},
            p.${dbRef.properties.id},
            p.${dbRef.properties.p_city},
            p.${dbRef.properties.p_street},
            p.${dbRef.properties.p_lot},
            p.${dbRef.properties.p_condo},
            p.${dbRef.properties.p_unit},
            p.${dbRef.properties.p_state},
            p.${dbRef.properties.p_zip},
            p.${dbRef.properties.p_status},
            p.${dbRef.properties.p_type},
            p.${dbRef.properties.p_assign},
            p.${dbRef.properties.p_comp_ref},
            p.${dbRef.properties.p_instructions},
            p.${dbRef.properties.p_number},
            p.${dbRef.properties.p_requester},
            p.${dbRef.properties.p_request_date},
            p.${dbRef.properties.p_closed_date},
            p.${dbRef.properties.p_file},
            p.${dbRef.properties.c_file},
            p.${dbRef.properties.p_book_1},
            p.${dbRef.properties.p_book_2},
            p.${dbRef.properties.p_page_1},
            p.${dbRef.properties.p_page_2},
            p.${dbRef.properties.p_cert_1}
          FROM ${dbRef.table_names.properties} p
          LEFT JOIN ${dbRef.table_names.clients} c
          ON c.${dbRef.clients.c_number} = p.${dbRef.properties.p_number}
          WHERE 
            p.${dbRef.properties.id} IS NOT NULL
            ${param.p_city}
            ${param.p_street}
            ${param.p_lot}
            ${param.p_condo}
            ${param.p_instructions}
            ${param.c_name}
            ${param.p_type}
            ${param.p_status}
            ${param.p_comp_ref}
            ${param.p_file}
            ${param.inputDateRange}
            ${param.requestDateRange}
          ORDER BY 
            p.${dbRef.properties.p_street},
            p.${dbRef.properties.p_lot}
        `,[
            p_city,
            p_street.toLowerCase(),
            p_lot.toLowerCase(),
            p_condo.toLowerCase(),
            p_instructions.toLowerCase(),
            c_name,
            p_type,
            p_status,
            p_comp_ref,
            p_file,
            inputStartDate,
            inputEndDate,
            requestStartDate,
            requestEndDate
          ]
        )
        
        const propertiesResults = (await conn.query(propertiesQuery)).rows
          res.status(200).json(propertiesResults)
      } catch ( error ) {
          console.log( error );
      }
    }
}

