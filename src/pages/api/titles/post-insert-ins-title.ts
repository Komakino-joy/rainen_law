import { hasValue } from '@/utils'
import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 
      const {
        fileNumber=0,
        city= '',
        street= '',
        lot= '',
        condo= '',
        unit= '',
        clientName='',
        premiumDue=0,
        premiumPaid=0,
        agentFee=0,
        ticoFee=0,
        titleCompany=99,
        oPolicyNumber= '',
        lPolicyNumber= '',
        oPolicyAmount=0,
        lPolicyAmount=0,
        status= '',
        dateBilled= null,
        datePaid= null,
        billNumber=0,
        policyDate= null,
        assigned= '',
        printed= '',
        clientFileNumber= '',
        state= '',
        zip= '',
        notes= '',
        created_by,
        last_updated_by,
      } = req.body

      try {
        await conn.query('BEGIN')

        // We need to get the Client Number from our DB since there is no reference to it in the ins table
        // We will use this as the INMBR field
        const clientIDQuery = 'SELECT cm."CNMBR" FROM public.clntmstr cm WHERE cm."CNAME" = ($1)'
        const clientIdResponse = await conn.query(clientIDQuery, [hasValue(clientName) ? clientName : 'NO_CLIENT_NAME_0'])

        const addNewInsTitleQuery = pgPromise.as.format(`
          INSERT INTO public.ins
          (
            "IFILE",
            "ICITY",
            "ISTRET",
            "ILOT",
            "ICONDO",
            "IUNIT",
            "INMBR",
            "PREMDUE",
            "PREMPAID",
            "AGENTFEE",
            "TICOFEE",
            "TITLECO",
            "OPOLICYNUM",
            "LPOLICYNUM",
            "OPOLICYAMT",
            "LPOLICYAMT",
            "ISTAT",
            "ICDATE",
            "IPDATE",
            "IBILL",
            "IPOLDATE",
            "IREMIT",
            "P",
            "CFILE",
            "ISTATE",
            "IZIP",
            "INOTES",
            created_by,
            last_updated_by,
            created_at,
            last_viewed,
            last_updated
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
            $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, 
            $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32)

            RETURNING *
          ;
        `,[
            fileNumber,
            city,
            street,
            lot,
            condo,
            unit,
            clientIdResponse.rows[0].CNMBR,
            premiumDue,
            premiumPaid,
            agentFee,
            ticoFee,
            titleCompany,
            oPolicyNumber,
            lPolicyNumber,
            oPolicyAmount,
            lPolicyAmount,
            status,
            hasValue(dateBilled) ? dateBilled : null,
            hasValue(datePaid) ? datePaid : null,
            billNumber,
            hasValue(policyDate) ? policyDate : null,
            assigned,
            printed,
            clientFileNumber,
            state,
            zip,
            notes,
            created_by,
            last_updated_by,
            new Date(),
            new Date(),
            new Date()
          ]
        )

        const newRecord = await conn.query(addNewInsTitleQuery)
        await conn.query('COMMIT')
        
        res.status(200).json({
          newInsTitleId: newRecord.rows[0].id,
          message: 'New record inserted',
          status: 'success'
        })
        
      } catch ( error ) {
        await conn.query('ROLLBACK')
        console.log( error );
        res.status(400).json({
          newInsTitleId: null,
          message: 'Failed to insert record',
          status: 'failure'
        })
      } 
    }
}

