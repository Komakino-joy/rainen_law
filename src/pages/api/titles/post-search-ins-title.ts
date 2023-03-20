import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 

      const {
        titleCity='',  
        titleCompanyName='',
        titleNumber='', 
        titleStatus='', 
        titleState='',
        titleZip='',
        policyStartDate='', 
        policyEndDate='',
        lPolicyNum='', 
        oPolicyNum=''
      } = req.body

      const andEqualsClause = (table:string, field:string, paramNum:string) => {
        return `AND ${table}."${field}" = $${paramNum}`
      }

      const andBetweenClause = (table:string, field:string, startParam:string, endParam:string) => {
        return `AND ${table}."${field}" BETWEEN DATE($${startParam}) AND DATE($${endParam})`
      }

      const andLikeClause = (table:string, field:string, paramNum:string) => {
        return `AND LOWER(${table}."${field}") LIKE '%' || $${paramNum} || '%'`
      }

      const param = {
        titleCity: titleCity !== '' ? andEqualsClause('ins','ICITY', '1') : '',
        titleCompanyName: titleCompanyName !== '' ? andEqualsClause('ins','TITLECO', '2') : '',
        titleNumber: titleNumber !== '' ? andEqualsClause('ins','INMBR', '3') : '',
        titleStatus: titleStatus !== '' ? andEqualsClause('ins','ISTAT', '4'): '',
        titleState: titleState !== '' ? andEqualsClause('ins','CSTATE', '5'): '',
        titleZip: titleZip !== '' ? andEqualsClause('ins','CZIP', '6'): '',
        policyDateRange: policyStartDate !== '' && policyEndDate !== '' ? andBetweenClause('ins','IPOLDATE', '7', '8'): '',
        lPolicyNum: lPolicyNum !== '' ? andLikeClause('ins','LPOLICYNUM', '9'): '',
        oPolicyNum: oPolicyNum !== '' ? andLikeClause('ins','OPOLICYNUM', '10'): '',
      }

      try {
        const insTitlesQuery = pgPromise.as.format(`
          SELECT
            comp.tticoname,
            ins."IFILE",
            ins."ICITY",
            ins."ISTRET",
            ins."ILOT",
            ins."ICONDO",
            ins."IUNIT",
            ins."INMBR",
            ins."PREMDUE",
            ins."PREMPAID",
            ins."AGENTFEE",
            ins."TICOFEE",
            ins."RWFEE",
            ins."TITLECO",
            ins."OPOLICYNUM",
            ins."LPOLICYNUM",
            ins."OPOLICYAMT",
            ins."LPOLICYAMT",
            ins."ISTAT",
            ins."ICDATE" "AS DATEBILLED",
            ins."IPDATE" AS "DATEPAID",
            ins."IBILL",
            ins."IPOLDATE" AS "POLICYDATE",
            ins."IREMIT",
            ins."ISTATE",
            ins."IZIP"
          FROM public.ins ins             
          LEFT JOIN public.companies comp
            ON ins."TITLECO" = comp.tnmbr
          LEFT JOIN public.clntmstr cm 
            ON cm."CNMBR" = ins."INMBR"
          WHERE ins.id IS NOT NULL
          ${param.titleCity}
          ${param.titleCompanyName}
          ${param.titleNumber}
          ${param.titleStatus}
          ${param.titleState}
          ${param.titleZip}
          ${param.policyDateRange}
          ${param.lPolicyNum}
          ${param.oPolicyNum}
          ORDER BY comp.tticoname
          ;
        `,[
            titleCity,  
            titleCompanyName,
            titleNumber, 
            titleStatus, 
            titleState,
            titleZip,
            policyStartDate, 
            policyEndDate,
            lPolicyNum.toLowerCase(),
            oPolicyNum.toLowerCase()
          ]
        )
        const insTitlesResults = (await conn.query(insTitlesQuery)).rows
          res.status(200).json(insTitlesResults)
      } catch ( error ) {
          console.log( error );
      }
    }
}

