import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      try {
        const { page } = req.body
        const pageSize = 50
        const pageOffset = pageSize * (page - 1)
    
        const totalRecordsQuery = `select COUNT(*) from public."propmstr"`
        const totalRecordsResult = (await conn.query(totalRecordsQuery)).rows[0].count;
    
        const allProperties = `
          SELECT 
            cm."CNAME",
            pm."PTDATE",
            pm."PCITY",
            pm."PSTRET",
            pm."PLOT",
            pm."PCONDO",
            pm."PUNIT",
            pm."PNMBR",
            pm."PREQ",
            pm."PTYPE",
            pm."PSTAT",
            pm."PCOMPREF",
            pm."PINSTR",
            pm."PROPID"
          FROM public."propmstr" pm
          LEFT JOIN public."clntmstr" cm 
          ON cm."CNMBR" = pm."PNMBR"
          ORDER BY pm."PROPID" DESC
          OFFSET $1 LIMIT ${pageSize}
        `
        const propertiesResults = (await conn.query(allProperties, [pageOffset])).rows;
    
        res.status(200).send({
          properties: propertiesResults,
          totalRecords: Number(totalRecordsResult),
          pageSize, 
          currentPage: Number(page)
        })
        
      } catch ( error ) {
          console.log( error );
          res.status(400).send({message: 'Failed to get properties'})
      }
    }
}

