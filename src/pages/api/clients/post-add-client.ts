import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 

      const {
        clientName='',
        searchName='', 
        addressLine1='', 
        addressLine2='', 
        city='',
        state='',
        zip='',
        phone='',
        fax='',
        contact='',
        status='', 
        statementAddressee='',
        email='',
        notes=''
      } = req.body

      try {

        await conn.query('BEGIN')

        // Need to get the latest CNMBR + 1 so we can assign it to the new Client
        const newCNMBRQuery = 'SELECT MAX(cm."CNMBR") FROM public.clntmstr cm;'
        const clientIdResponse = await conn.query(newCNMBRQuery)
        const newCNMBR = clientIdResponse.rows[0].max + 1

        const addNewClientQuery = pgPromise.as.format(`
          INSERT INTO public.clntmstr
          (
            "CNMBR",
            "CNAME",
            "CSEARCH",
            "CADD1",
            "CADD2",
            "CCITY",
            "CSTATE",
            "CZIP",
            "CPHONE",
            "CFAX",
            "CCNTCT",
            "CSTAT",
            "CSTATTO", 
            "CEMAIL",
            "CNOTES",
            "LAST_UPDATED"
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
            $12, $13, $14, $15, $16)

            RETURNING *
          ;
        `,[
            newCNMBR,
            clientName,
            searchName, 
            addressLine1, 
            addressLine2, 
            city,
            state,
            zip,
            phone,
            fax,
            contact,
            status, 
            statementAddressee,
            email,
            notes,
            new Date(),
          ]
        )

        const newRecord = await conn.query(addNewClientQuery)
        await conn.query('COMMIT')
        
        res.status(200).json({
          newClientId: newRecord.rows[0].id,
          message: 'New record inserted',
          status: 'success'
        })
        
      } catch ( error ) {
        await conn.query('ROLLBACK')
        console.log( error );
        res.status(400).json({
          newPropId: null,
          message: 'Failed to insert record',
          status: 'failure'
        })
      } 
    }
}

