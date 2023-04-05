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
        city='', 
        street='', 
        lot='', 
        condo='', 
        instructions='',
        client='', 
        type='', 
        status='',
        compRef='',
        fileNumber='',
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
        city: city !== '' ? andEqualsClause('pm','p_city', '1') : '',
        street: street !== '' ? andLikeClause('pm','p_street', '2') : '',
        lot: lot !== '' ? andLikeClause('pm','p_lot', '3') : '',
        condo: condo !== '' ? andLikeClause('pm','p_condo', '4'): '',
        instructions: instructions !== '' ? andLikeClause('pm','p_instructions', '5') : '',
        client: client !== '' ? andEqualsClause('cm','CNAME', '6') : '',
        type: type !== '' ? andEqualsClause('pm','p_type', '7') : '',
        status: status !== '' ? andEqualsClause('pm','p_status', '8'): '',
        compRef: compRef !== '' ? andEqualsClause('pm','p_comp_ref', '9'): '',
        fileNumber: fileNumber !== '' ? andEqualsClause('pm','p_file', '10'): '',
        inputDateRange: inputStartDate !== '' && inputEndDate !== '' ? andBetweenClause('pm','p_input_date', '11', '12'): '',
        requestDateRange: requestStartDate !== '' && requestEndDate !== '' ? andBetweenClause('pm','p_request_date', '13', '14'): '',
      }

      try {
        const propertiesQuery = pgPromise.as.format(`
          SELECT
            cm."CNAME",  
            cm."CNMBR",
            pm.id,
            pm.p_city,
            pm.p_street,
            pm.p_lot,
            pm.p_condo,
            pm.p_unit,
            pm.p_state,
            pm.p_zip,
            pm.p_status,
            pm.p_type,
            pm.p_assign,
            pm.p_comp_ref,
            pm.p_instructions,
            pm.p_number,
            pm.p_requester,
            pm.p_request_date,
            pm.p_closed_date,
            pm.p_file,
            pm.c_file,
            pm.p_book_1,
            pm.p_book_2,
            pm.p_page_1,
            pm.p_page_2,
            pm.p_cert_1
          FROM public.properties pm
          LEFT JOIN public.clntmstr cm
          ON cm."CNMBR" = pm.p_number
          WHERE pm.id IS NOT NULL
          ${param.city}
          ${param.street}
          ${param.lot}
          ${param.condo}
          ${param.instructions}
          ${param.client}
          ${param.type}
          ${param.status}
          ${param.compRef}
          ${param.fileNumber}
          ${param.inputDateRange}
          ${param.requestDateRange}
          ORDER BY 
            pm.p_street,
            pm.p_lot;
        `,[
            city,
            street.toLowerCase(),
            lot.toLowerCase(),
            condo.toLowerCase(),
            instructions.toLowerCase(),
            client,
            type,
            status,
            compRef,
            fileNumber,
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

