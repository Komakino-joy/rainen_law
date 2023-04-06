import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import conn from '../../../lib/db'
import dbRef from '@/constants/dbRefs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 

      const {
        username,
        password
      } = req.body

      try {
        const selectQuery = `
            SELECT * 
            FROM ${dbRef.table_names.users}  
            WHERE LOWER(${dbRef.users.username}) = $1;
          `
        const queryResults = await conn.query(selectQuery, [username.toLowerCase()])

        const hash = queryResults.rows[0][dbRef.users.password]
       
        bcrypt.compare(password, hash, function(err, result) {
          if(err) {
            console.log(err)
            res.status(400).json({
              message: 'Something went wrong, please try again later.',
              status: 'error'
            })
            return
          }
          
          if(result === true) {
            res.status(200).json({
              user: {
                id: queryResults.rows[0][dbRef.users.id],
                username: queryResults.rows[0][dbRef.users.username],
                f_name: queryResults.rows[0][dbRef.users.f_name],
                l_name: queryResults.rows[0][dbRef.users.l_name],
              }
            })
          } else {
            res.status(200).json({
              message: 'Invalid credentials',
              status: 'error'
            })
          }
        });

      } catch ( error ) {
        console.log( error )
        res.status(400).json({
          message: 'Something went wrong, please try again later.',
          status: 'error'
        })
      }
    }
}


