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
        closedDate
      } = req.body

      try {

        await conn.query('BEGIN')
        const clientIDQuery = 'SELECT cm."CNMBR" FROM public.clntmstr cm WHERE cm."CNAME" = ($1)'
        const clientIdResponse = await conn.query(clientIDQuery, [clientName])

        const addNewPropertyQuery = pgPromise.as.format(`
          INSERT INTO public."propmstr"
          (
            "PTDATE",
            "PCITY",
            "PSTRET",
            "PLOT",
            "PCONDO",
            "PUNIT",
            "PBOOK1",
            "PBOOK2",
            "PPAGE1",
            "PPAGE2",
            "PCERT1",
            "PNMBR",
            "PREQ",
            "PFILE", 
            "PTYPE",
            "PSTAT",
            "PASIGN",
            "PCOMPREF",
            "PINSTR",
            "CFILE",
            "FILE",
            "PSTATE",
            "PZIP",
            "PDOCNUM",
            "PRDATE",
            "PCDATE"
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
            $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, 
            $22, $23, $24, $25, $26)

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
            closedDate === '' ? null : closedDate
          ]
        )

        const newRecord = await conn.query(addNewPropertyQuery)
        await conn.query('COMMIT')
        
        res.status(200).json({
          newPropId: newRecord.rows[0].PROPID,
          message: 'New record inserted.'
        })
        
      } catch ( error ) {
        await conn.query('ROLLBACK')
        console.log( error );
      } 
    }
}

