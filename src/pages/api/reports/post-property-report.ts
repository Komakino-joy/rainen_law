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
              pm.p_input_date, 
              pm.p_lot, 
              pm.p_street, 
              pm.p_city, 
              city."COUNTY" AS county_code, 
              cnt.county AS county_name,
              pm.p_comp_ref, 
              pm.p_number, 
              cm."CNAME", 
              pm.p_type, 
              pm.p_assign, 
              pm."p_assign2",
              pm.p_status
            FROM public.properties pm 
              LEFT JOIN public.clntmstr cm ON pm.p_number = cm."CNMBR"
              LEFT JOIN public.examiners e1 ON pm.p_assign = e1.code 
              LEFT JOIN public.examiners e2 ON pm."p_assign2" = e2.code
              LEFT JOIN public.city city ON pm.p_city = city."CITY"
              LEFT JOIN public.counties cnt ON cnt.code = city."COUNTY"
            WHERE pm.p_input_date BETWEEN DATE($1) AND DATE($2)
            AND pm.p_status != 'C';
        `,[startDate, endDate]
        )
        
        const propertiesReportResults = (await conn.query(propertiesReportQuery)).rows    
        res.status(200).json(propertiesReportResults)

      } catch ( error ) {
          console.log( error );
      }
    }
}

