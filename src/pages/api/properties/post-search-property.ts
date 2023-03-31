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
        city: city !== '' ? andEqualsClause('pm','PCITY', '1') : '',
        street: street !== '' ? andLikeClause('pm','PSTRET', '2') : '',
        lot: lot !== '' ? andLikeClause('pm','PLOT', '3') : '',
        condo: condo !== '' ? andLikeClause('pm','PCONDO', '4'): '',
        instructions: instructions !== '' ? andLikeClause('pm','PINSTR', '5') : '',
        client: client !== '' ? andEqualsClause('cm','CNAME', '6') : '',
        type: type !== '' ? andEqualsClause('pm','PTYPE', '7') : '',
        status: status !== '' ? andEqualsClause('pm','PSTAT', '8'): '',
        compRef: compRef !== '' ? andEqualsClause('pm','PCOMPREF', '9'): '',
        fileNumber: fileNumber !== '' ? andEqualsClause('pm','PFILE', '10'): '',
        inputDateRange: inputStartDate !== '' && inputEndDate !== '' ? andBetweenClause('pm','PTDATE', '11', '12'): '',
        requestDateRange: requestStartDate !== '' && requestEndDate !== '' ? andBetweenClause('pm','PRDATE', '13', '14'): '',
      }

      try {
        const propertiesQuery = pgPromise.as.format(`
          SELECT
            cm."CNAME",  
            cm."CNMBR",
            pm.id,
            pm."PCITY",
            pm."PSTRET",
            pm."PLOT",
            pm."PCONDO",
            pm."PUNIT",
            pm."PSTATE",
            pm."PZIP",
            pm."PSTAT",
            pm."PTYPE",
            pm."PASIGN",
            pm."PCOMPREF",
            pm."PINSTR",
            pm."PNMBR",
            pm."PREQ",
            pm."PRDATE",
            pm."PCDATE",
            pm."PFILE",
            pm."CFILE",
            pm."PBOOK1",
            pm."PBOOK2",
            pm."PDOCNUM",
            pm."PPAGE1",
            pm."PPAGE2",
            pm."PCERT1",
            pm."EXPORT" AS "QBEXPORT"
          FROM public.propmstr pm
          LEFT JOIN public.clntmstr cm
          ON cm."CNMBR" = pm."PNMBR"
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
          ORDER BY cm."CNMBR"
          ;
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

