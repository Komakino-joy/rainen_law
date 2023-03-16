import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 

      const {
        clientName,
        clientNumber,
        clientCity,
        clientContact,
        clientEmail,
        clientFax,
        clientPhone,
        clientStat,
        clientState,
        clientStatementAddressee,
        clientZip
      } = req.body


      const andEqualsClause = (table:string, field:string, paramNum:string) => {
        return `AND ${table}."${field}" = $${paramNum}`
      }

      const param = {
        clientName: clientName !== '' ? andEqualsClause('cm','CNAME', '1') : '',
        clientNumber: clientNumber !== '' ? andEqualsClause('cm','CNMBR', '2') : '',
        clientCity: clientCity !== '' ? andEqualsClause('cm','CCITY', '3') : '',
        clientContact: clientContact !== '' ? andEqualsClause('cm','CCNTCT', '4') : '',
        clientEmail: clientEmail !== '' ? andEqualsClause('cm','CEMAIL', '5') : '',
        clientFax: clientFax !== '' ? andEqualsClause('cm','CFAX', '6') : '',
        clientPhone: clientPhone !== '' ? andEqualsClause('cm','CPHONE', '7') : '',
        clientStat: clientStat !== '' ? andEqualsClause('cm','CSTAT', '8') : '',
        clientState: clientState !== '' ? andEqualsClause('cm','CSTATE', '9') : '',
        clientStatementAddressee: clientStatementAddressee !== '' ? andEqualsClause('cm','CSTATTO', '10') : '',
        clientZip: clientZip !== '' ? andEqualsClause('cm','CZIP', '11') : '',
      }

      try {
        const clientsQuery = pgPromise.as.format(`
            SELECT 
              cm.id,
              cm."CNAME",
              cm."CNMBR",
              cm."CADD1",
              cm."CADD2",
              cm."CCITY",
              cm."CSTATE",
              cm."CZIP",
              cm."CPHONE",
              cm."CFAX",
              true as "ISCLIENT",
              COALESCE(pc."PROPCOUNT", 0) as "PROPCOUNT",
              COALESCE(i."TITLESCOUNT", 0) as "TITLESCOUNT"
            FROM public."clntmstr" cm
            LEFT JOIN (
                SELECT 
                    pm."PNMBR", 
                    COUNT(*) AS "PROPCOUNT" 
                FROM public.propmstr pm
                GROUP BY pm."PNMBR"
            ) pc ON pc."PNMBR" = cm."CNMBR"
            LEFT JOIN (
                SELECT 
                    i."INMBR", 
                    COUNT(*) AS "TITLESCOUNT" 
                FROM public.ins i
                GROUP BY i."INMBR"
            ) i ON i."INMBR" = cm."CNMBR"
  
          WHERE cm.id IS NOT NULL
          ${param.clientName}
          ${param.clientNumber}
          ${param.clientCity}
          ${param.clientContact}
          ${param.clientEmail}
          ${param.clientFax}
          ${param.clientPhone}
          ${param.clientStat}
          ${param.clientState}
          ${param.clientStatementAddressee}
          ${param.clientZip}
          ORDER BY cm."CNAME"
          ;
        `,[
            clientName,
            clientNumber,
            clientCity,
            clientContact,
            clientEmail,
            clientFax,
            clientPhone,
            clientStat,
            clientState,
            clientStatementAddressee,
            clientZip
          ]
        )
        
        const clientsResults = (await conn.query(clientsQuery)).rows
            
        res.status(200).json(clientsResults)

      } catch ( error ) {
          console.log( error );
      }
    }
}

