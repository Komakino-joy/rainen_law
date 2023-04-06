import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'
import dbRef from '@/constants/dbRefs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      try {
        const getInsTitlesInfoQuery = `
            SELECT 
              ${dbRef.insurance_titles.id},
              ${dbRef.insurance_titles.i_street},
              ${dbRef.insurance_titles.i_city},
              ${dbRef.insurance_titles.i_lot},
              ${dbRef.insurance_titles.i_condo},
              ${dbRef.insurance_titles.i_unit}
            FROM ${dbRef.table_names.insurance_titles} 
            WHERE ${dbRef.insurance_titles.i_number} = $1
            ORDER BY 
              ${dbRef.insurance_titles.i_city},
              ${dbRef.insurance_titles.i_street},
              ${dbRef.insurance_titles.i_lot};
          `
        const result = await conn.query(getInsTitlesInfoQuery, [req.body.inmbr])

        res.status(200).json({
          titles: result.rows,
          count: result.rowCount
        })
      
      } catch ( error ) {
          console.log( error )
      }
    }
}
