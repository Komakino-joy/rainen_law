import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 

      const { 
        startDate, 
        endDate 
      } = req.body

      try {
        const propertiesReportQuery = pgPromise.as.format(`
            SELECT 
              pm."PTDATE", 
              pm."PLOT", 
              pm."PSTRET", 
              pm."PCITY", 
              city."COUNTY" AS county_code, 
              cnt.county AS county_name,
              pm."PCOMPREF", 
              pm."PNMBR", 
              cm."CNAME", 
              pm."PTYPE", 
              pm."PASIGN", 
              pm."PASIGN2",
              pm."PSTAT"
            FROM public.propmstr pm 
              LEFT JOIN public.clntmstr cm ON pm."PNMBR" = cm."CNMBR"
              LEFT JOIN public.examiners e1 ON pm."PASIGN" = e1.code 
              LEFT JOIN public.examiners e2 ON pm."PASIGN2" = e2.code
              LEFT JOIN public.city city ON pm."PCITY" = city."CITY"
              LEFT JOIN public.counties cnt ON cnt.code = city."COUNTY"
            WHERE pm."PTDATE" BETWEEN DATE($1) AND DATE($2)
            AND pm."PSTAT" != 'C';
        `,[startDate, endDate]
        )
        
        const propertiesReportResults = (await conn.query(propertiesReportQuery)).rows    
        res.status(200).json(propertiesReportResults)

      } catch ( error ) {
          console.log( error );
      }
    }
}

