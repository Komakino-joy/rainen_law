import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import conn from '../../../lib/db'

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
            FROM public.users  
            WHERE LOWER(username) = $1;
          `
        const queryResults = await conn.query(selectQuery, [username.toLowerCase()])

        const hash = queryResults.rows[0].password
       
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
              user: queryResults.rows[0]
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


