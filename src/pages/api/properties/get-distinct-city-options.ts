
import dbRef from '@/constants/dbRefs'
import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "GET") { 
      try {
        const getDistinctCities = `
            SELECT DISTINCT p.${dbRef.properties.p_city} 
            FROM ${dbRef.table_names.properties} p 
            ORDER BY p.${dbRef.properties.p_city};
          `
        const result = await conn.query(getDistinctCities)
        
        res.status(200).json(result.rows)
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


