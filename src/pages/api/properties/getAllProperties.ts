import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      try {
        const totalRecordsQuery = `select COUNT(*) from public."propmstr"`
        const totalRecordsResult = (await conn.query(totalRecordsQuery)).rows[0].count;
 
        const propertiesQuery = `select * from public."propmstr" LIMIT 10`
        const propertiesResults = (await conn.query(propertiesQuery)).rows;
          res.status(200).json({
            totalRows: totalRecordsResult,
            rows: propertiesResults
          })
      } catch ( error ) {
          console.log( error );
      }
    }
}

