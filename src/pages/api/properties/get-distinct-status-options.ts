
import dbRef from '@/constants/dbRefs'
import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "GET") { 
      try {
        const getDistinctTypes = `
            SELECT DISTINCT p.${dbRef.properties.p_status} 
            FROM ${dbRef.table_names.properties} p 
            WHERE p.${dbRef.properties.p_status} IS NOT NULL
            ORDER BY p.${dbRef.properties.p_status} ASC;
          `
        const result = await conn.query(getDistinctTypes)
        
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


