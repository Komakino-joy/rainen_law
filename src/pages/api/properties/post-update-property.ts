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
        city='', 
        street='', 
        lot='', 
        condo='', 
        unit='', 
        book1='',
        book2='',
        page1='',
        page2='',
        cert1='',
        requester='', 
        fileNumber=0, 
        type='', 
        status='',
        assigned='',
        compRef=0,
        instructions='',
        clientFileNumber='',
        state='',
        zip='',
        docNumber='',
        requestDate,
        closedDate,
        id
      } = req.body

      try {

        await conn.query('BEGIN')
        const clientIDQuery = 'SELECT cm."CNMBR" FROM public.clntmstr cm WHERE cm."CNAME" = ($1)'
        const clientIdResponse = await conn.query(clientIDQuery, [clientName])

        const addNewPropertyQuery = pgPromise.as.format(`
          UPDATE public."propmstr" pm
          SET
            "PTDATE" = $1,
            "PCITY" = $2,
            "PSTRET" = $3,
            "PLOT" = $4,
            "PCONDO" = $5,
            "PUNIT" = $6,
            "PBOOK1" = $7,
            "PBOOK2" = $8,
            "PPAGE1" = $9,
            "PPAGE2" = $10,
            "PCERT1" = $11,
            "PNMBR" = $12,
            "PREQ" = $13,
            "PFILE" = $14, 
            "PTYPE" = $15,
            "PSTAT" = $16,
            "PASIGN" = $17,
            "PCOMPREF" = $18,
            "PINSTR" = $19,
            "CFILE" = $20,
            "FILE" = $21,
            "PSTATE" = $22,
            "PZIP" = $23,
            "PDOCNUM" = $24,
            "PRDATE" = $25,
            "PCDATE" = $26,
            "LAST_UPDATED" = $27 
          
          WHERE pm."PROPID" = $28

            RETURNING *
          ;
        `,[
            new Date(),
            city,
            street,
            lot,
            condo,
            unit,
            book1,
            book2,
            page1,
            page2,
            cert1,
            Number(clientIdResponse.rows[0].CNMBR),
            requester,
            fileNumber,
            type,
            status,
            assigned,
            Number(compRef),
            instructions,
            clientFileNumber,
            Number(fileNumber),
            state,
            zip,
            docNumber,
            requestDate === '' ? null : requestDate,
            closedDate === '' ? null : closedDate,
            new Date(),
            id,
          ]
        )

        const updatedRecord = await conn.query(addNewPropertyQuery)
        await conn.query('COMMIT')
        
        console.log(updatedRecord.rows[0])

        res.status(200).json({
          updatedRecord: updatedRecord.rows[0],
          message: 'Record updated',
          status: 'success'
        })
        
      } catch ( error ) {
        await conn.query('ROLLBACK')
        console.log( error );
        res.status(400).json({
          message: 'Failed to update record',
          status: 'error'
        })
      } 
    }
}

