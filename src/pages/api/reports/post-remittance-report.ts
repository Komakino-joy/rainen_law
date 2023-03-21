import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 

      const { 
        companyTnmbr 
      } = req.body

      const query = companyTnmbr === '*' ? '' : 'AND comp.tnmbr = $1'

      try {
        const remittanceReportQuery = pgPromise.as.format(`
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
              COALESCE(ins."PREMPAID",0) As Filter, 
              comp.tticoname, 
              comp.tadd1, 
              comp.tstate, 
              comp.tcity, 
              comp.tzip, 
              ins."AGENTFEE"
          FROM public.ins ins
              INNER JOIN public.clntmstr cm ON ins."INMBR" = cm."CNMBR" 
              INNER JOIN public.companies comp ON ins."TITLECO" = comp.tnmbr
          WHERE COALESCE(ins."PREMPAID",0) = 0
          ${query}
          ORDER BY ins."IBILL";
        `,[companyTnmbr]
        )
        
        const remittanceReportResults = (await conn.query(remittanceReportQuery)).rows    
        res.status(200).json(remittanceReportResults)

      } catch ( error ) {
          console.log( error );
      }
    }
}

