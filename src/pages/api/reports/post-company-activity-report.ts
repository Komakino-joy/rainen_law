import type { NextApiRequest, NextApiResponse } from 'next'
import pgPromise from 'pg-promise'
import conn from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method === "POST") { 

      const { 
        startDate, 
        endDate 
      } = req.body

      try {
        const totalDollarsQuery = pgPromise.as.format(`
          SELECT 
            comp.tnmbr, 
            comp.tticoname, 
            ROUND(AVG(i."PREMDUE")::numeric, 2) AS avg_prem,
            ROUND(SUM((CASE WHEN i."IPOLDATE" BETWEEN '6/2/2014' AND '3/30/2015' THEN i."PREMDUE" END))::numeric, 2) AS selected_period,
            ROUND(SUM((CASE WHEN EXTRACT(QUARTER FROM i."IPOLDATE") = 1 THEN i."PREMDUE" END))::numeric, 2) AS qtr_1,
            ROUND(SUM((CASE WHEN EXTRACT(QUARTER FROM i."IPOLDATE") = 1 THEN i."AGENTFEE" END))::numeric, 2) AS qtr_1_af,
            ROUND(SUM((CASE WHEN EXTRACT(QUARTER FROM i."IPOLDATE") = 2 THEN i."PREMDUE" END))::numeric, 2) AS qtr_2,
            ROUND(SUM((CASE WHEN EXTRACT(QUARTER FROM i."IPOLDATE") = 2 THEN i."AGENTFEE" END))::numeric, 2) AS qtr_2_af,
            ROUND(SUM((CASE WHEN EXTRACT(QUARTER FROM i."IPOLDATE") = 3 THEN i."PREMDUE" END))::numeric, 2) AS qtr_3,
            ROUND(SUM((CASE WHEN EXTRACT(QUARTER FROM i."IPOLDATE") = 3 THEN i."AGENTFEE" END))::numeric, 2) AS qtr_3_af,
            ROUND(SUM((CASE WHEN EXTRACT(QUARTER FROM i."IPOLDATE") = 4 THEN i."PREMDUE" END))::numeric, 2) AS qtr_4,
            ROUND(SUM((CASE WHEN EXTRACT(QUARTER FROM i."IPOLDATE") = 4 THEN i."AGENTFEE" END))::numeric, 2) AS qtr_4_af
          FROM public.companies comp 
          RIGHT JOIN public.ins i ON i."TITLECO"  = comp.tnmbr
          WHERE i."IPOLDATE" BETWEEN DATE($1) AND DATE($2)
          GROUP BY 
            comp.tnmbr, 
            comp.tticoname
          ORDER BY 
            comp.tnmbr
          ;
        `,[startDate, endDate]
        )
        
        const totalDollarsPctQuery = pgPromise.as.format(`
          SELECT 
            comp.tnmbr, 
            comp.tticoname, 
            ROUND((SUM(i."PREMDUE")/
            ( 
              SELECT SUM(i2."PREMDUE") 
              FROM public.companies comp 
              RIGHT JOIN public.ins i2 
                ON i2."TITLECO"  = comp.tnmbr
              WHERE i2."IPOLDATE" 
                BETWEEN DATE($1) AND DATE($2)
            )*100)::numeric, 2) AS avg_pct_all,
            ROUND((SUM((CASE WHEN EXTRACT(QUARTER FROM i."IPOLDATE") = 1 THEN i."PREMDUE" END))/SUM(i."PREMDUE")*100)::numeric, 2) AS qtr_1,
            ROUND((SUM((CASE WHEN EXTRACT(QUARTER FROM i."IPOLDATE") = 2 THEN i."PREMDUE" END))/SUM(i."PREMDUE")*100)::numeric, 2) AS qtr_2,
            ROUND((SUM((CASE WHEN EXTRACT(QUARTER FROM i."IPOLDATE") = 3 THEN i."PREMDUE" END))/SUM(i."PREMDUE")*100)::numeric, 2) AS qtr_3,
            ROUND((SUM((CASE WHEN EXTRACT(QUARTER FROM i."IPOLDATE") = 4 THEN i."PREMDUE" END))/SUM(i."PREMDUE")*100)::numeric, 2) AS qtr_4
          FROM public.companies comp 
          RIGHT JOIN public.ins i ON i."TITLECO"  = comp.tnmbr
          WHERE i."IPOLDATE" BETWEEN DATE($1) AND DATE($2)
          GROUP BY 
            comp.tnmbr, 
            comp.tticoname
          ORDER BY 
            comp.tnmbr;
          `,[startDate, endDate]
        )

        const yearlyTotalsQuery = pgPromise.as.format(`
          SELECT 
            comp.tnmbr, 
            comp.tticoname,
            COALESCE(ROUND(SUM(CASE WHEN date_part('year', i."IPOLDATE") = 2014 THEN i."PREMDUE" END):: numeric, 2),0) AS total_prem_ytd,
            COALESCE(ROUND(SUM(CASE WHEN date_part('year', i."IPOLDATE") = 2014 THEN i."AGENTFEE" END):: numeric, 2),0) AS total_prem_ytd_af,
            COALESCE(ROUND(SUM(CASE WHEN date_part('year', i."IPOLDATE") = 2014 THEN i."AGENTFEE" END):: numeric, 2),0) AS total_agent_fee_ytd,
            COALESCE(ROUND(SUM(CASE WHEN i."IPOLDATE" > (DATE(CURRENT_DATE) - INTERVAL '12 months') THEN i."PREMDUE" END):: numeric, 2),0) AS total_prem_past_12_months,
            COALESCE(ROUND(SUM(CASE WHEN i."IPOLDATE" > (DATE(CURRENT_DATE) - INTERVAL '12 months') THEN i."AGENTFEE" END):: numeric, 2),0) AS total_prem_past_12_months_af,
            COALESCE(ROUND(AVG(i."PREMDUE"):: numeric,2),0) AS average_prem,
            COALESCE(ROUND(AVG(i."AGENTFEE"):: numeric,2),0) AS average_prem_af
          FROM public.companies comp  
          RIGHT JOIN public.ins i ON i."TITLECO"  = comp.tnmbr
          GROUP BY 
            comp.tnmbr, 
            comp.tticoname
          ORDER BY comp.tnmbr;
        `
        )

        const totalDollarsResults = (await conn.query(totalDollarsQuery)).rows 
        const totalDollarsPctResults = (await conn.query(totalDollarsPctQuery)).rows 
        const yearlyTotalsResults = (await conn.query(yearlyTotalsQuery)).rows 

        res.status(200).json({
          totalDollars: totalDollarsResults,
          totalDollarsPct:totalDollarsPctResults,
          yearlyTotals: yearlyTotalsResults
        })

      } catch ( error ) {
          console.log( error);
      }
    }
}

