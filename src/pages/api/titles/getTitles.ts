import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "GET") { 
      try {
        const query = `
          SELECT
            public.ins."IDTITLE",
            public.ins."IFILE" AS FileNumber,
            public.ins."IBILL" AS BillNumber,
            public.ins."ICITY" AS City,
            public.ins."ISTRET" AS Street,
            public.ins."ILOT" AS Lot,
            public.ins."ICONDO" AS Condo,
            public.ins."IUNIT" AS Unit,
            public."clntmstr"."CNAME" AS Client,
            public.ins."PREMDUE" AS [Premium Due],
            public.ins."PREMPAID" AS [Premium Paid],
            public.ins."ICDATE" AS [Date Billed],
            public.ins."IPOLDATE" AS [Policy Date],
            public.ins."INOTES" AS Notes,
            public.ins."IPDATE" AS [Date Paid],
            public.ins."LPOLICYNUM" AS [L Policy],
            public.ins."OPOLICYNUM" AS [O Policy],
            public.ins."LPOLICYAMT" AS [L Policy Amt],
            public.ins."OPOLICYAMT" AS [O Policy Amt],
            public.ins."LASTVIEWED" AS [Last Viewed]
          FROM
            public.ins
            LEFT JOIN public."clntmstr" ON public.ins."INMBR" = public."clntmstr"."CNMBR"
          ORDER BY
            public.ins."IFILE",
            public.ins."IBILL",
            public.ins."ICITY",
            public.ins."ISTRET",
            public.ins."ILOT",
            public.ins."ICONDO",
            public.ins."IUNIT",
            public."clntmstr"."CNAME",
            public.ins."PREMDUE",
            public.ins."PREMPAID",
            public.ins."ICDATE",
            public.ins."IPOLDATE",
            public.ins."INOTES",
            public.ins."IPDATE",
            public.ins."LPOLICYNUM",
            public.ins."OPOLICYNUM",
            public.ins."LPOLICYAMT",
            public.ins."OPOLICYAMT",
            public.ins."LASTVIEWED";
        `
        const result = await conn.query(query);
          res.status(200).json(result.rows)
      } catch ( error ) {
          console.log( error );
      }
    }
}


