import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 

      const { 
        clientName 
      } = req.body

      const query = clientName === '*' ? '' : 'AND cm."CNAME" = $1'

      try {
        const outstandingInsTitlesQuery = pgPromise.as.format(`
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
            ins."PREMPAID"
          FROM
            public.ins ins
            INNER JOIN public.clntmstr cm ON ins."INMBR" = cm."CNMBR"
          WHERE
            COALESCE(ins."PREMPAID", 0) = 0
            ${query}
          ORDER BY
            ins."IBILL";
        `, [clientName]
        )
        
        const outstandingInsTitlesResults = (await conn.query(outstandingInsTitlesQuery)).rows    
  
        res.status(200).json(outstandingInsTitlesResults)

      } catch ( error ) {
          console.log( error );
      }
    }
}

