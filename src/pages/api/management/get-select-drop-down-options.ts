import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "GET") { 
      try {
        const propertyTypesQuery = `SELECT * FROM prop_types;`
        const propertyTypesResult = await conn.query(propertyTypesQuery)

        const propertyStatusQuery = `SELECT * FROM prop_status;`
        const propertyStatusResult = await conn.query(propertyStatusQuery)

        const clientStatusQuery = `SELECT * FROM client_status;`
        const clientStatusResult = await conn.query(clientStatusQuery)

        const insStatusQuery = `SELECT * FROM ins_status;`
        const insStatusResult = await conn.query(insStatusQuery)
  
        res.status(200).json({
          propertyTypeOptions: propertyTypesResult.rows,
          propertyStatusOptions: propertyStatusResult.rows,
          clientStatusOptions: clientStatusResult.rows,
          insStatusOptions: insStatusResult.rows,
        })
      
      } catch ( error ) {
          console.log( error )
      }
    }
}


