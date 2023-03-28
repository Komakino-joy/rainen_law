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
        id='',
        last_updated_by,
      } = req.body

      if(!hasValue(id)) {
        res.status(400).json({
          newInsTitleId: null,
          message: 'Failed to insert record',
          status: 'failure'
        })
      }

      try {
        await conn.query('BEGIN')

        // We need to get the Client Number from our DB since there is no reference to it in the ins table
        // We will use this as the INMBR field
        const clientIDQuery = 'SELECT cm."CNMBR" FROM public.clntmstr cm WHERE cm."CNAME" = ($1)'
        const clientIdResponse = await conn.query(clientIDQuery, [hasValue(clientName) ? clientName : 'NO_CLIENT_NAME_0'])

        const updateInsTitleQuery = pgPromise.as.format(`
            UPDATE public.ins
            SET 
              "IFILE" = $1,
              "ICITY" = $2,
              "ISTRET" = $3,
              "ILOT" = $4,
              "ICONDO" = $5,
              "IUNIT" = $6,
              "INMBR" = $7,
              "PREMDUE" = $8,
              "PREMPAID" = $9,
              "AGENTFEE" = $10,
              "TICOFEE" = $11,
              "TITLECO" = $12,
              "OPOLICYNUM" = $13,
              "LPOLICYNUM" = $14,
              "OPOLICYAMT" = $15,
              "LPOLICYAMT" = $16,
              "ISTAT" = $17,
              "ICDATE" = $18,
              "IPDATE" = $19,
              "IBILL" = $20,
              "IPOLDATE" = $21,
              "IREMIT" = $22,
              "P" = $23,
              "CFILE" = $24,
              "ISTATE" = $25,
              "IZIP" = $26,
              "INOTES" = $27,
              last_updated_by = $28,
              last_updated = $29
            WHERE ins.id = $30

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
            last_updated_by,
            new Date(),
            id
          ]
        )

        const newRecord = await conn.query(updateInsTitleQuery)
        await conn.query('COMMIT')
        
        res.status(200).json({
          newInsTitleId: newRecord.rows[0].id,
          message: 'Record updated',
          status: 'success'
        })
        
      } catch ( error ) {
        await conn.query('ROLLBACK')
        console.log( error );
        res.status(400).json({
          newInsTitleId: null,
          message: 'Failed to update record',
          status: 'failure'
        })
      } 
    }
}

