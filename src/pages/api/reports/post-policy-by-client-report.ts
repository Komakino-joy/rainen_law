import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      const {
        clientName,
        startDate, 
        endDate
      } = req.body

      try {
        const getPoliciesByClientReportQuery = `
          SELECT 
              cm."CNAME", 
              cm."CADD1", 
              cm."CADD2", 
              cm."CCITY", 
              cm."CSTATE", 
              cm."CZIP", 
              cm."CCNTCT", 
              ins."ISTRET", 
              ins."ICITY", 
              ins."OPOLICYNUM", 
              ins."LPOLICYNUM", 
              ins."OPOLICYAMT", 
              ins."LPOLICYAMT", 
              ins."IFILE", 
              ins."ILOT", 
              ins."IPOLDATE", 
              ins."PREMDUE", 
              ins."IBILL", 
              ins."PREMPAID", 
              COALESCE(ins."PREMPAID",0) AS "FILTER", 
              comp.tticoname
          FROM ins 
          INNER JOIN clntmstr cm 
              ON ins."INMBR" = cm."CNMBR"
          INNER JOIN public.companies comp 
              ON ins."TITLECO" = comp.tnmbr
          WHERE COALESCE(ins."PREMPAID",0)=0
          AND cm."CNAME" = ($1)
          AND ins."IPOLDATE" BETWEEN DATE($2) AND DATE($3)
          ORDER BY ins."IBILL" LIMIT 100;
        `
        const result = await conn.query(getPoliciesByClientReportQuery, [       
          clientName,
          startDate, 
          endDate])
  
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


