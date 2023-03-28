import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt';
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      const {
        username,
        f_name,
        l_name,
        password,
        confirmPassword,
        id
      } = req.body

      if (password !== confirmPassword) {
        res.status(200).json({
          message: 'Passwords do not match',
          status: 'error'
        })
      }

      try {
        await conn.query('BEGIN')

        bcrypt.genSalt(10, async function(err, salt) {
          if (err) {
            console.log(err)
            return false
          }
          bcrypt.hash(password, salt, async function(err: any, hash:string) {
              if (err) {
                console.log(err)
                return false
              }
              const updateQuery = pgPromise.as.format(`
                  UPDATE public.users
                  SET
                    username=$1,
                    f_name=$2,
                    l_name=$3,
                    password=$4,
                    last_updated=$5
                  WHERE id = $6
                  RETURNING *
                ;
              `,[
                username,
                f_name,
                l_name,
                hash,
                new Date(),
                id
                ]
              )
      
              const updatedRecord = await conn.query(updateQuery)
              await conn.query('COMMIT')
              
              res.status(200).json({
                updatedRecord: updatedRecord.rows[0],
                message: 'Record Updated',
                status: 'success'
              })
              
          });
        });


        
      } catch ( error ) {
        await conn.query('ROLLBACK')
        console.log( error );
        res.status(400).json({
          message: 'Failed to update record',
          status: 'failure'
        })
      } 
    }
}

