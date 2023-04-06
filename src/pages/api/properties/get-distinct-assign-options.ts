
import dbRef from '@/constants/dbRefs'
import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "GET") { 
      try {
        const getDistinctAssign = `
            SELECT 
            DISTINCT p.${dbRef.properties.p_assign} 
            FROM ${dbRef.table_names.properties} p 
            WHERE p.${dbRef.properties.p_assign} IS NOT NULL 
            ORDER BY p.${dbRef.properties.p_assign};
          `
        const result = await conn.query(getDistinctAssign)
        
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


