import dbRef from '@/constants/dbRefs'
import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      try {
        const getClientPropertyInfoQuery = `
            SELECT * 
            FROM ${dbRef.table_names.properties} p 
            WHERE p.${dbRef.properties.p_number} = $1
            ORDER BY 
              p.${dbRef.properties.p_input_date}  DESC,
              p.${dbRef.properties.p_city},
              p.${dbRef.properties.p_street};
          `
        const result = await conn.query(getClientPropertyInfoQuery, [req.body.c_number])
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


